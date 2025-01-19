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

        const oauth2Client = new google.auth.OAuth2(
            process.env.GMAIL_CLIENT_ID,
            process.env.GMAIL_CLIENT_SECRET,
            process.env.GMAIL_REDIRECT_URI
        );

        req.headers.authorization = `Bearer ${state}`;
        
        authMiddleware(req, res, async () => {
            try {
                const { tokens } = await oauth2Client.getToken(code as string);
                
                if (!req.user?.id) {
                    throw new Error("No user ID found");
                }

                oauth2Client.setCredentials(tokens);
                const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
                const profile = await gmail.users.getProfile({ userId: 'me' });
                const userEmail = profile.data.emailAddress;

                await setupGmailHook(req.user.id, tokens);

                // Send HTML response instead of JSON
                const html = `
                    <html>
                        <body>
                            <script>
                                window.opener.postMessage(
                                    { 
                                        type: 'gmail_auth_callback',
                                        email: '${userEmail}'
                                    }, 
                                    '*'
                                );
                                window.close();
                            </script>
                        </body>
                    </html>
                `;
                
                res.send(html);
            } catch (error) {
                const errorHtml = `
                    <html>
                        <body>
                            <script>
                                window.opener.postMessage(
                                    { 
                                        type: 'gmail_auth_error',
                                        error: 'Gmail setup failed'
                                    }, 
                                    '*'
                                );
                                window.close();
                            </script>
                        </body>
                    </html>
                `;
                res.send(errorHtml);
            }
        });
    } catch (error) {
        res.send(`
            <html>
                <body>
                    <script>
                        window.opener.postMessage(
                            { 
                                type: 'gmail_auth_error',
                                error: 'Gmail setup failed'
                            }, 
                            '*'
                        );
                        window.close();
                    </script>
                </body>
            </html>
        `);
    }
});

router.post("/gmail/notification", async (req, res) => {
    try {
        const data = req.body;
        console.log("Received Gmail notification:", data);
        
        const triggers = await dbClient.trigger.findMany({
            where: {
                type: {
                    id: "email"
                }
            },
            include: {
                zap: {
                    include: {
                        actions: {
                            where: {
                                actionId: "notion"
                            }
                        }
                    }
                }
            }
        });

        for (const trigger of triggers) {
            const metadata = trigger.metadata as any;
            const tag = metadata?.tag;
            const notionAction = trigger.zap?.actions?.[0];
            
            if (data.labelIds?.includes(tag) && notionAction) {
                console.log(`Processing email with tag: ${tag}`);
                
                await dbClient.$transaction(async tx => {
                    const run = await tx.zapRun.create({
                        data: {
                            zapId: trigger.zapId,
                            metadata: {
                                messageId: data.emailId,
                                tag: tag,
                                notionDatabaseId: metadata.notionDatabaseId
                            }
                        }
                    });

                    await tx.zapRunOutBox.create({
                        data: { zapRunId: run.id }
                    });
                });
            }
        }
        res.status(200).send('OK');
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: String(error) });
    }
});


export const triggerRouter = router;