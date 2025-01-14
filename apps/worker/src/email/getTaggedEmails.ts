import { google } from 'googleapis';
import { dbClient } from '../db/db.js';

async function getGmailClient() {
    const auth = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    // Get latest auth tokens from database
    const gmailAuth = await dbClient.gmailAuth.findFirst({
        orderBy: { createdAt: 'desc' }
    });

    if (!gmailAuth) {
        throw new Error('No Gmail authentication found');
    }

    auth.setCredentials({
        refresh_token: gmailAuth.refreshToken,
        access_token: gmailAuth.accessToken
    });

    return google.gmail({ version: 'v1', auth });
}

export async function fetchEmailWithTag(tag: string) {
    try {
        const gmail = await getGmailClient();
        
        // Search for emails with specific tag
        const response = await gmail.users.messages.list({
            userId: 'me',
            q: `label:${tag}`,
            maxResults: 10 // Limit results
        });

        if (!response.data.messages) {
            return [];
        }

        // Get full email content for each message
        const emails = await Promise.all(
            response.data.messages.map(async (message) => {
                const email = await gmail.users.messages.get({
                    userId: 'me',
                    id: message.id as string
                });

                const headers = email.data.payload?.headers;
                return {
                    id: email.data.id,
                    subject: headers?.find(h => h.name === 'Subject')?.value || '',
                    from: headers?.find(h => h.name === 'From')?.value || '',
                    date: headers?.find(h => h.name === 'Date')?.value || '',
                    snippet: email.data.snippet || '',
                    body: email.data.payload?.body?.data || ''
                };
            })
        );

        return emails;
    } catch (error) {
        console.error('Error fetching emails:', error);
        throw error;
    }
}