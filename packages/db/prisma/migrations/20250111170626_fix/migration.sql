/*
  Warnings:

  - You are about to drop the column `lableId` on the `gmailAuth` table. All the data in the column will be lost.
  - You are about to drop the column `notionDbId` on the `gmailAuth` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "gmailAuth" DROP COLUMN "lableId",
DROP COLUMN "notionDbId";
