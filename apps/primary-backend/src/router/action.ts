import 'dotenv/config';
import { Router } from "express";
import { dbClient } from "../db/db.js";
import { authMiddleware } from "../middleware.js";
import { google } from "googleapis";
import axios from 'axios';
const router = Router();

const NOITON_AUTHORIZATION_URL =process.env.NOITON_AUTHORIZATION_URL || "";

router.get("/available", async (req,res) => {
    const availableActions = await dbClient.availableAction.findMany({});
    res.json({
        availableActions,
    })
})

router.get("/notion/auth", authMiddleware, (req,res) => {
    res.redirect(NOITON_AUTHORIZATION_URL)
})


router.get("/notion/callback", async (req,res) => {
  const {code} = req.query;

  if(!code) {
      return res.status(400).json({
          message: "AUthorization COde is missing"
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
    
export const actionRouter = router;