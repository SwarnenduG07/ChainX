/*
  Warnings:

  - The primary key for the `GmailAuth` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `GmailAuth` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "GmailAuth" DROP CONSTRAINT "GmailAuth_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "GmailAuth_pkey" PRIMARY KEY ("id");
