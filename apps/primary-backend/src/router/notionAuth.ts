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


router.get("/notion/callback", async (req,res) => {
  const {code} = req.query;

  if(!code) {
      return res.status(400).json({
          message: "AUthorization Code is missing"
      })
  }

  try {
     const response = await axios.post("https://api.notion.com/v1/oauth/token", {
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.NOTION_REDIRECT_URI,
        client_id: process.env.NOTION_CLIENT_ID,
        client_secret: process.env.NOTION_CLIENT_SECRET,
     });

     const { access_token, workspace_id, workspace_name } = response.data;

     res.status(200).json({
         access_token,
         workspace_id,
         workspace_name,
     })
  } catch (error: any) {
    console.error('Error during token exchange:', error.response.data || error.message);
    res.status(500).send('Failed to connect to Notion');
    
  }
})
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