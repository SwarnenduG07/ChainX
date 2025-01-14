-- CreateTable
CREATE TABLE "gmailAuth" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "lableId" TEXT NOT NULL,
    "notionDbId" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gmailAuth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "gmailAuth_userId_idx" ON "gmailAuth"("userId");

-- AddForeignKey
ALTER TABLE "gmailAuth" ADD CONSTRAINT "gmailAuth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
