/*
  Warnings:

  - You are about to drop the column `expiryDate` on the `GmailAuth` table. All the data in the column will be lost.
  - You are about to drop the column `tokenType` on the `GmailAuth` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `GmailAuth` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `GmailAuth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `GmailAuth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GmailAuth" DROP COLUMN "expiryDate",
DROP COLUMN "tokenType",
DROP COLUMN "updateAt",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "GmailAuth_userId_idx" ON "GmailAuth"("userId");
