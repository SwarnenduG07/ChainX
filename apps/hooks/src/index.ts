import express from "express";
import { dbClient } from "./db/db.js";
const app = express();
app.use(express.json());

app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
    const userId = req.body.userId;
    const zapId = req.body.zapId;
    const body = req.body;
    await dbClient.$transaction(async()  => {
         const run = await dbClient.zapRun.create({
            data: {
                zapId: zapId,
                metadata: body,
            }
         });
         await dbClient.zapRunOutBox.create({
            data : {
                zapRunId: run.id,
            }
         })
    })
    res.json({
        message :"WebHook receved"
    })
})

app.listen(3001, () => {
    console.log("Loistening on PORT 3001 ");
    
})