import { Router, Request, Response } from "express";
import { SigninSchema, SignupSchema } from "../types/types";
import { dbClient } from "../db/db";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { authMiddleware } from "../middleware";
dotenv.config();

const router = Router();

const generateToken = () => crypto.randomBytes(32).toString("hex");

router.post("/signup", async (req: Request, res: Response) => {
   const body = req.body;
   const parsedData = SignupSchema.safeParse(body);

   if (!parsedData.success) {
      console.log(parsedData.error);
      return res.status(411).json({
         message: "Invalid input",
      });
   }
   const userExists = await dbClient.user.findFirst({
      where: {
         email: parsedData.data.username,
      }
   });
   if(userExists) {
      return res.status(403).json({
         message: "User Already Exists"
      })
   };
   const token = generateToken();
   const expiration = new Date(Date.now() + 24 * 60 *  60 *1000);
   const hashedpassword = await bcrypt.hash(parsedData.data.password,  10);
   const user = await dbClient.user.create({
      data: {
         email: parsedData.data.username,
         password: hashedpassword,
         name: parsedData.data.name,
         verificationToken: token,
         verificationTokenExpiry: expiration,
         isVerified: false,
      }
   });
   const verificationUrl =  `idonthavedomail.com/verifyemail?token=${token}`;
      const mailoptions = {
      from: 'noreply@yourdomail.com',
      to: user.email,
      subject: "Veryfy your email",
      html: `<p>Place verify your email by clicking the link below:</p> <a href="${verificationUrl}"> Verify Email</a>`
  }
  return res.status(401).json({
     message: "Plese veryfi your account by checking your email"
  })
});

router.get("/verifyemail", async (req: Request,res: Response) => {
   const token = req.query.token;
   const tokenString = Array.isArray(token) ? token : [token];
   if(typeof tokenString !== 'string' ) {
      return res.status(400).json({
         message: "Invalid token formate"
      });
   }
   const user = await dbClient.user.findFirst({
      where: {
         verificationToken: tokenString,
         verificationTokenExpiry: {
            gte: new Date()
         }
      }
   });
   if (!user) {
      return res.json({
         message: "invalid or Expired token"
      })
   };
   await dbClient.user.update({
      where: {
         id: user.id,
      }   ,
      data: {
         isVerified: true,
         verificationToken: null,
         verificationTokenExpiry: null
      }
   });
   return res.json({
      message: "Email verified Successfully"
   })
})

router.post("/signin", async (req:Request,res: Response) => {
   const body = req.body;
   const parsedData = SigninSchema.safeParse(body);
   if(!parsedData.success) {
     return res.status(411).json({
      Message: "Incorrect Inputs"
     });
   }
   const user = await dbClient.user.findFirst({
      where:{
         email: parsedData.data.username,
      }
   });
   if(!user) {
      return res.status(403).json({
         message: "Sorry credentials are incorrect"
      });
   }
   const ispassowrdValid = await bcrypt.compare(parsedData.data.password, user.password);

   if(!ispassowrdValid) {
      return res.status(403).json({
         Message: "Invalid Credentials"
      });
   }
   const token = jwt.sign({
      id: user.id
  }, process.env.JWT_SECRET || "secret");

  res.json({
      token: token,
  });

})
router.post("/forgotpassword", async (req:Request, res:Response) => {
   const { username } = req.body;
   try {
       const user = await dbClient.user.findFirst({
           where: { email: username }
       });

       if (!user) {
           return res.status(404).json({ message: "User not found" });
       }

       const reset = crypto.randomBytes(20).toString("hex");
       const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); 

       await dbClient.user.update({
           where: { email: username },
           data: {
               resetToken: reset, 
               resetTokenExpiry
           }
       });

       const resetUrl = `https://yourdomain.com/reset-password?token=${reset}`;
       const mailOptions = {
           from: 'noreply@yourdomain.com',
           to: username,
           subject: "Password Reset Request",
           html: `<p>You requested a password reset. Click the link below to reset your password:</p><a href="${resetUrl}">Reset Password</a>`
       };

       // await transporter.sendMail(mailOptions);

       return res.json({ message: "Password reset email sent" });
   } catch (e) {
       console.log("Error while resetting the password", e);
       res.status(500).json({ message: "Internal Server Error" });
   }
   });

router.post("/reset-password", async (req:Request,res:Response) => {
   const { token ,  newPassword } = req.body
   try {
       const user = await dbClient.user.findFirst({
           where: {
               resetToken: token,
               resetTokenExpiry: {
               gte: new Date()
               }
           }
       });
       if (!user) {
           return res.json({
               message: "Invalid or expired token"
           })
       }

       const hashedpassword = await bcrypt.hash(newPassword, 10);
       await dbClient.user.update({
           where: {
               id: user.id,
           },
           data: {
               password: hashedpassword,
               resetToken: null,
               resetTokenExpiry: null,
           }
       });
       res.json({
           message: "Password reset succecful"
       })
   } catch (e) {
       console.log("Error while resating passwprd",e);
       res.status(500).json({
           message: "Internal server error"
       })
       
   }
})

router.get("/", authMiddleware, async (req: Request, res: Response) => {
   //@ts-expect-error
   const id = req.id;
   const user = await dbClient.user.findFirst({
       where: {
           id
       },
       select: {
           name: true,
           email: true
       }
   });

   return res.json({
       user
   });
})

export const userRouter = router;
