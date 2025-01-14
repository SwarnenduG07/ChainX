import 'dotenv/config'
import { google } from 'googleapis';
import { dbClient } from '../db/db.js';

export async function setupGmailHook(userId: number, tokens: any) {

    try {
        const oauth2Client = new google.auth.OAuth2(
            process.env.GMAIL_CLIENT_ID,
            process.env.GMAIL_CLIENT_SECRET,
            process.env.GMAIL_REDIRECT_URI
        );

        oauth2Client.setCredentials(tokens);
        
        // Store tokens in database first
        await dbClient.gmailAuth.create({
            data: {
                refreshToken: tokens.refresh_token || '',
                accessToken: tokens.access_token || '',
                expiresAt: new Date(tokens.expiry_date || Date.now()),
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        });

        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

        // Set up Gmail push notifications with proper topic name
        const response = await gmail.users.watch({
            userId: 'me',
            requestBody: {
                topicName: process.env.GMAIL_TOPIC_NAME,
                labelIds: ['INBOX']
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error setting up Gmail hook:', error);
        throw error;
    }
}