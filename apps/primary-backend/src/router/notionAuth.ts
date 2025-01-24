import 'dotenv/config';
import axios from "axios";
import { Router } from "express";
import { authMiddleware } from "../middleware.js";

const router = Router();

const NOITON_AUTHORIZATION_URL = process.env.NOITON_AUTHORIZATION_URL || "";


router.get("/notion/auth", authMiddleware, async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const redirectTo = req.query.redirectTo || process.env.FRONTEND_ORIGIN;
  
      const state = encodeURIComponent(
        JSON.stringify({ token, redirectTo })
      );
  
      const params = new URLSearchParams({
        client_id: process.env.NOITON_OAUTH_CLIENT_ID || "",
        redirect_uri: process.env.NOTION_REDIRECT_URI || "",
        response_type: "code",
        state,
        owner: "user",
      });
  
      const authUrl = `https://api.notion.com/v1/oauth/authorize?${params.toString()}`;
      res.json({ authUrl });
    } catch (e) {
      res.status(500).json({ error: "Failed to generate auth URL" });
    }
  });

  router.get("/notion/callback", async (req, res) => {
    try {
      const { code, state } = req.query;
  
      if (!code) {
        throw new Error("No authorization code received");
      }
  
      // Decode the state parameter
      const decodedState = JSON.parse(decodeURIComponent(state as string));
      const redirectTo = decodedState.redirectTo || process.env.FRONTEND_ORIGIN;
  
      // Exchange code for access token
      const tokenResponse = await axios.post('https://api.notion.com/v1/oauth/token', {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.NOTION_REDIRECT_URI
      }, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${process.env.NOITON_OAUTH_CLIENT_ID}:${process.env.NOTION_OAUTH_CLIENT_SECRET}`).toString('base64')}`,
          'Content-Type': 'application/json'
        }
      });
  
      // Add access token and workspace data to the redirect URL
      const queryParams = new URLSearchParams({
        workspace_name: tokenResponse.data.workspace_name,
        access_token: tokenResponse.data.access_token,
        workspace_id: tokenResponse.data.workspace_id,
      });
  
      // Redirect the user to the frontend with the additional query parameters
      res.redirect(`${redirectTo}?${queryParams.toString()}`);
    } catch (error: any) {
      console.error("Error in Notion callback:", error.message);
  
      // Redirect with an error message if something goes wrong
      const errorParams = new URLSearchParams({
        error: "notion_auth_failed",
        message: "Failed to complete Notion authentication",
      });
  
      const { state } = req.query;
      const decodedState = state ? JSON.parse(decodeURIComponent(state as string)) : {};
      const redirectTo = decodedState.redirectTo || process.env.FRONTEND_ORIGIN;
  
      res.redirect(`${redirectTo}?${errorParams.toString()}`);
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