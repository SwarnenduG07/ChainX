import { Router } from "express";
import { authMiddleware } from "../middleware";
import { ZapSchema } from "../types/types";
import { dbClient } from "../db/db";

const router = Router();

router.post("/", authMiddleware,  async (req, res) => {
    //@ts-ignore
      const id: string = req.id;
      const body = req.body;
      const parsedData = ZapSchema.safeParse(body);
      if (!parsedData.success) {
        return res.status(411).json({
            message: "Incorrect Inputs"
        });
      }
      const zapId = await dbClient.$transaction(async (tx) => {
        try {
            const zap = await tx.zap.create({
                data: {
                    userId: parseInt(id),
                    triggerId: "",
                    actions: {
                        create: parsedData.data.actions.map((x, index) => ({
                            actionId: x.availableActionId,
                            sortringOrder: index,
                            metadata: x.actionMetaData,
                        }))
                    }
                }
            });
            const trigger = await tx.trigger.create({
                data: {
                    triggerId: parsedData.data.availableTriggerId,
                    zapId: zap.id
                },
            });
            await tx.zap.update({
                where: {
                    id: zap.id,
                },
                data: {
                    triggerId
                    : trigger.id,
                }
            });
            return zap.id;
        } catch (e) {
            console.log(e, "Error in zap creation");
            throw e;
        }
      });
      return res.json({
          zapId,
      })
})

router.get("/", authMiddleware, async  (req,res) => {
    //@ts-ignore
    const id = req.id;
    const zaps = await dbClient.zap.findFirst({
      where: {
        userId: id,
      },
      include: {
        actions: {
            include: {
                type: true,
            },
        },
        trigger: {
            include: {
                type: true,
            }
        }
      }
    })
    return res.json({
        zaps,
    });
})

router.get("/:zapId", authMiddleware, async (req,res) => {
    //@ts-ignore
    const id = req.id;
    const zapId = req.params.zapId;

    const zap = await dbClient.zap.findFirst({
        where:{
            id: zapId,
            userId: id,
        },
        include: {
            actions: {
                include: {
                    type: true
                }
            },
            trigger: {
                include :{
                    type: true,
                }
            }
        }
    });
    return res.json({
        zap,
    })
})

export const zapRouter = router;
