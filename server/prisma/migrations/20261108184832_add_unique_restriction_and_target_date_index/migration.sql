/*
  Warnings:

  - A unique constraint covering the columns `[userId,targetDate]` on the table `Entry` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Entry_targetDate_idx" ON "Entry"("targetDate");

-- CreateIndex
CREATE UNIQUE INDEX "Entry_userId_targetDate_key" ON "Entry"("userId", "targetDate");
