
import { Keypair, LAMPORTS_PER_SOL, SystemProgram, Transaction, PublicKey, sendAndConfirmTransaction, Connection } from "@solana/web3.js";
import base58 from "bs58";
import { dbClient } from "./db/db";


const connection = new Connection("https://api.mainnet-beta.solana.com", "finalized");

export async function sendSol(zapRunId: string , to: string, amount: string) {
    const keypair = Keypair.fromSecretKey(base58.decode((process.env.SOL_PRIVATE_KEY ?? "")))
    console.log(keypair.publicKey);
  
    const existingTransaction = await dbClient.transaction.findFirst({
        where: {
          zapRunId,
          type: "send-sol",
        }
    });
    if (existingTransaction) {
       const txnStatus = await connection.getSignatureStatus(existingTransaction.txSignature);
       if(txnStatus && txnStatus.value?.confirmationStatus === "finalized") {
        console.log(`Transaction for zaprunID ${zapRunId} is already confremed`);
        return;
       } else {
        console.log(`Trasaction of zaprunId ${zapRunId} is pending or field. Reattepting...`);
       }
    }
    const transferTransaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: keypair.publicKey,
          toPubkey: new PublicKey(to),
          lamports: parseFloat(amount) * LAMPORTS_PER_SOL, // 0.1 => 10 ^ 8
        })
    );
     
    try {
       const signature = await sendAndConfirmTransaction(connection, transferTransaction, [keypair]);
      console.log("sol Sent!" ,signature)
      if(!existingTransaction) {
          await dbClient.transaction.create({
            data: {
                zapRunId,
                txSignature: signature,
                type: "send-sol",
                status: "pending",
            }
        });
    } else {
       await dbClient.transaction.update({
        where: {
          id: existingTransaction.id,
        },
        data: {
          txSignature: signature,
          status: "pending",
          }
       })
    }
     await dbClient.transaction.update({
      where: {
        zapRunId,
      },
      data: {
        status: "finalized",
        },
     })
      console.log(`trasaction for zapRunID ${zapRunId} finalized`);
      
    } catch (e: any) {
       console.log("Error while sending Sol", e);

       await dbClient.transaction.update({
        where: {zapRunId},
        data: {
          status: "failed",
        }
       });
       
    }


}