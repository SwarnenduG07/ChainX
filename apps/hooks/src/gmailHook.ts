import dotenv from 'dotenv';
dotenv.config();
import { google } from 'googleapis';

export async function setupGmailHook(userId: string, tokens: any) {
    const auth = new google.auth.OAuth2(
        process.env.GMAIL_CLIENT_ID,
        process.env.GMAIL_CLIENT_SECRET,
        process.env.GMAIL_REDIRECT_URI
    );
    auth.setCredentials(tokens);

    const gmail = google.gmail({ version: 'v1', auth });

    const res = await gmail.users.watch({
        userId: 'me',
        requestBody: {
            topicName: process.env.GMAIL_TOPIC_NAME || 'projects/chainx-446910/topics/gmail-topic',
            labelIds: ['INBOX'],
        },
    });

    console.log("Webhook setup", res.data);
}