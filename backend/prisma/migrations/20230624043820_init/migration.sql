/*
  Warnings:

  - You are about to drop the column `gameP1Id` on the `GameHistory` table. All the data in the column will be lost.
  - You are about to drop the column `gameP1Score` on the `GameHistory` table. All the data in the column will be lost.
  - You are about to drop the column `gameP2Id` on the `GameHistory` table. All the data in the column will be lost.
  - You are about to drop the column `gameP2Score` on the `GameHistory` table. All the data in the column will be lost.
  - You are about to drop the `Friend` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MemberBan` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `loserId` to the `GameHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `loserScore` to the `GameHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `winnerId` to the `GameHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `winnerScore` to the `GameHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_friendId_fkey";

-- DropForeignKey
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_memberId_fkey";

-- DropForeignKey
ALTER TABLE "GameHistory" DROP CONSTRAINT "GameHistory_gameP1Id_fkey";

-- DropForeignKey
ALTER TABLE "GameHistory" DROP CONSTRAINT "GameHistory_gameP2Id_fkey";

-- DropForeignKey
ALTER TABLE "MemberBan" DROP CONSTRAINT "MemberBan_banId_fkey";

-- DropForeignKey
ALTER TABLE "MemberBan" DROP CONSTRAINT "MemberBan_memberId_fkey";

-- AlterTable
ALTER TABLE "GameHistory" DROP COLUMN "gameP1Id",
DROP COLUMN "gameP1Score",
DROP COLUMN "gameP2Id",
DROP COLUMN "gameP2Score",
ADD COLUMN     "loserId" TEXT NOT NULL,
ADD COLUMN     "loserScore" INTEGER NOT NULL,
ADD COLUMN     "winnerId" TEXT NOT NULL,
ADD COLUMN     "winnerScore" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "loseCnt" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "winCnt" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Friend";

-- DropTable
DROP TABLE "MemberBan";

-- CreateTable
CREATE TABLE "_friend" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ban" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_friend_AB_unique" ON "_friend"("A", "B");

-- CreateIndex
CREATE INDEX "_friend_B_index" ON "_friend"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ban_AB_unique" ON "_ban"("A", "B");

-- CreateIndex
CREATE INDEX "_ban_B_index" ON "_ban"("B");

-- AddForeignKey
ALTER TABLE "GameHistory" ADD CONSTRAINT "GameHistory_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Member"("intraId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameHistory" ADD CONSTRAINT "GameHistory_loserId_fkey" FOREIGN KEY ("loserId") REFERENCES "Member"("intraId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_friend" ADD CONSTRAINT "_friend_A_fkey" FOREIGN KEY ("A") REFERENCES "Member"("intraId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_friend" ADD CONSTRAINT "_friend_B_fkey" FOREIGN KEY ("B") REFERENCES "Member"("intraId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ban" ADD CONSTRAINT "_ban_A_fkey" FOREIGN KEY ("A") REFERENCES "Member"("intraId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ban" ADD CONSTRAINT "_ban_B_fkey" FOREIGN KEY ("B") REFERENCES "Member"("intraId") ON DELETE CASCADE ON UPDATE CASCADE;
