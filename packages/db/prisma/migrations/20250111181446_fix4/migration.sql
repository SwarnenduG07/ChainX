/*
  Warnings:

  - The primary key for the `GmailAuth` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "GmailAuth" DROP CONSTRAINT "GmailAuth_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "GmailAuth_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "GmailAuth_id_seq";
