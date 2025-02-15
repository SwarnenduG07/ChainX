import { Router } from "express";
import { authMiddleware } from "../middleware.js";
import { ZapSchema } from "../types/types.js";
import { dbClient } from "../db/db.js";

const router = Router();

router.post("/", authMiddleware, async (req, res) => {

    const id = req.user?.id;
    if (id === undefined) {
        return res.status(400).json({ message: "User ID is missing" });
    }
    const body = req.body;
    const parsedData = ZapSchema.safeParse(body);
    
    if (!parsedData.success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        });
    }   

    const zapId = await dbClient.$transaction(async (tx: { zap: { create: (arg0: { data: { userId: number; triggerId: string; actions: { create: { actionId: string; sortringOrder: number; metadata: any; }[]; }; }; }) => any; update: (arg0: { where: { id: any; }; data: { triggerId: any; }; }) => any; }; trigger: { create: (arg0: { data: { triggerId: string; zapId: any; }; }) => any; }; }) => {
        try {
          const zap = await tx.zap.create({
            data: {
              userId: id,
              triggerId: "",
              actions: {
                create: parsedData.data.actions.map((x, index) => ({
                  actionId: x.availableActionId,
                  sortringOrder: index,
                  metadata: x.actionMetaData,
                })),
              },
            },
          });
      
          const trigger = await tx.trigger.create({
            data: {
              triggerId: parsedData.data.availableTriggerId,
              zapId: zap.id,
            },
          });
      
          await tx.zap.update({
            where: { id: zap.id },
            data: { triggerId: trigger.id },
          });
      
          return zap.id;
        } catch (error) {
          console.error("Error while transaction", error);
          throw error;  // Ensure transaction rollback
        }
      });
    return res.json({
        zapId
    })
})

router.get("/", authMiddleware, async (req, res) => {
    
    const id = req.user?.id;
    const zaps = await dbClient.zap.findMany({
        where: {
            userId: id
        },
        include: {
            actions: {
               include: {
                    type: true
               }
            },
            trigger: {
                include: {
                    type: true
                }
            }
        }
    });

    return res.json({
        zaps
    })
})

router.get("/:zapId", authMiddleware, async (req, res) => {
    const id = req.user?.id;
    const zapId = req.params.zapId;

    const zap = await dbClient.zap.findFirst({
        where: {
            id: zapId,
            userId: id
        },
        include: {
            actions: {
               include: {
                    type: true
               }
            },
            trigger: {
                include: {
                    type: true
                }
            }
        }
    });

    return res.json({
        zap
    })

})

export const zapRouter = router;