import { Router } from "express";
import { dbClient } from "../db/db.js";

const router = Router();

router.get("/available", async (req,res) => {
    const availableActions = await dbClient.availableAction.findMany({});
    res.json({
        availableActions,
    })
})

export const actionRouter = router;