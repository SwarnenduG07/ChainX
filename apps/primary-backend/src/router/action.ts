import 'dotenv/config';
import { Router } from "express";
import { dbClient } from "../db/db.js";
import { authMiddleware } from "../middleware.js";
import axios from 'axios';
const router = Router();


router.get("/available", async (req,res) => {
    const availableActions = await dbClient.availableAction.findMany({});
    res.json({
        availableActions,
    })
})

    
export const actionRouter = router;