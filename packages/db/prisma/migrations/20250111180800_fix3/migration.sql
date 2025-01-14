/*
  Warnings:

  - You are about to drop the `gmailAuth` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "gmailAuth" DROP CONSTRAINT "gmailAuth_userId_fkey";

-- DropTable
DROP TABLE "gmailAuth";

-- CreateTable
CREATE TABLE "GmailAuth" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "tokenType" TEXT NOT NULL,
    "expiryDate" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GmailAuth_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GmailAuth" ADD CONSTRAINT "GmailAuth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
