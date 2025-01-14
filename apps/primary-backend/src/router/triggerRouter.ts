import 'dotenv/config'
import { Router } from "express";
import { dbClient } from "../db/db.js";
import { google } from "googleapis";
import { setupGmailHook } from "../email/setupGmailhook.js";
import { authMiddleware } from "../middleware.js";





const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID ,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI,
)

const router = Router();
router.get("/available", async (req, res) => {
    const availableTriggers = await dbClient.availableTrigger.findMany({});
    res.json({
        availableTriggers,
    })
}) 

router.get("/gmail/auth", authMiddleware, (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: [
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/gmail.modify',
            'https://www.googleapis.com/auth/pubsub',
            'https://www.googleapis.com/auth/cloud-platform'
        ],
        prompt: 'consent',
        state: token
    });
    
    res.json({ authUrl });
});

router.get("/gmail/callback", async (req, res) => {
    try {
        const { code, state } = req.query;
        
        if (!code) {
            throw new Error("No authorization code received");
        }

        // Set up OAuth2 client
        const oauth2Client = new google.auth.OAuth2(
            process.env.GMAIL_CLIENT_ID,
            process.env.GMAIL_CLIENT_SECRET,
            process.env.GMAIL_REDIRECT_URI
        );

        // Verify state token
        req.headers.authorization = `Bearer ${state}`;
        
        authMiddleware(req, res, async () => {
            try {
                // Exchange code for tokens
                const { tokens } = await oauth2Client.getToken(code as string);
                
                if (!req.user?.id) {
                    throw new Error("No user ID found");
                }

                await setupGmailHook(req.user.id, tokens);
                console.log('Gmail setup successful');
                
                res.redirect(`${process.env.FRONTEND_URL}/zap/create`);
            } catch (error) {
                console.error('OAuth error:', error);
                res.redirect(`${process.env.FRONTEND_URL}/error?message=gmail_setup_failed`);
            }
        });
    } catch (error: any) {
        console.error('Gmail callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/error?message=gmail_setup_failed`);
    }
});

router.post("/gmail/notification", async (req, res) => {
    try {
        const data = req.body;
        
        if (data.labelIds?.includes('INBOX')) {
            await dbClient.$transaction(async tx => {
                const run = await tx.zapRun.create({
                    data: {
                        zapId: 'save-to-notion',
                        metadata: {
                            messageId: data.emailId,
                            label: data.labelIds[0]
                        }
                    }
                });

                await tx.zapRunOutBox.create({
                    data: { zapRunId: run.id }
                });
            });
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: String(error) });
    }
});


export const triggerRouter = router;