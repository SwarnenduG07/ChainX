import 'dotenv/config';
import axios from "axios";
import { Router } from "express";
import { authMiddleware } from "../middleware.js";

const router = Router();

const NOITON_AUTHORIZATION_URL = process.env.NOITON_AUTHORIZATION_URL || "";


router.post("/notion/auth", authMiddleware, async (req,res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Authorization token is required" });
        }

        console.log("Authheader receved", token);

        const notionResponse = await axios.get(NOITON_AUTHORIZATION_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Handle the response from Notion
        res.status(200).json({
            message: "Successfully authenticated with Notion",
            data: notionResponse.data,
        });
    } catch (error) {
        console.error("Error authenticating with Notion:", error);
        res.status(500).json({ error: "Failed to authenticate with Notion" });
    }
})


router.get("/notion/callback", async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({
            message: "Authorization Code is missing"
        });
    }
    
    try {
        const credentials = Buffer.from(
            `${process.env.NOTION_OAUTH_CLIENT_ID}:${process.env.NOTION_OAUTH_CLIENT_SECRET}`
        ).toString('base64');

        const response = await axios.post(
            "https://api.notion.com/v1/oauth/token",
            {
                grant_type: "authorization_code",
                code,
                redirect_uri: process.env.NOTION_REDIRECT_URI
            },
            {
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const { access_token, workspace_id, workspace_name } = response.data;

        // Send HTML response with postMessage
        const html = `
            <html>
                <body>
                    <script>
                        window.opener.postMessage(
                            { 
                                type: 'notion_auth_callback',
                                access_token: '${access_token}',
                                workspace_id: '${workspace_id}',
                                workspace_name: '${workspace_name}'
                            }, 
                            '*'
                        );
                        window.close();
                    </script>
                </body>
            </html>
        `;
        
        return res.send(html);

    } catch (error: any) {
        const errorHtml = `
            <html>
                <body>
                    <script>
                        window.opener.postMessage(
                            { 
                                type: 'notion_auth_error',
                                error: '${encodeURIComponent(error.message || 'Failed to connect to Notion')}'
                            }, 
                            '*'
                        );
                        window.close();
                    </script>
                </body>
            </html>
        `;
        return res.send(errorHtml);
    }
});

router.get("/notion/databases", authMiddleware, async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ error: "Authorization token is required" });
      }
  
      const response = await axios.get('https://api.notion.com/v1/databases', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Notion-Version': '2022-06-28'
        }
      });
  
      const databases = response.data.results.map((db: any) => ({
        id: db.id,
        title: db.title[0]?.plain_text || 'Untitled'
      }));
  
      res.json({ databases });
    } catch (error) {
      console.error("Error fetching Notion databases:", error);
      res.status(500).json({ error: "Failed to fetch Notion databases" });
    }
  });

export const notionAuthRouter = router;