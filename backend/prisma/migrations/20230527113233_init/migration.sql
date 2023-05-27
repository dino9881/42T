/*
  Warnings:

  - You are about to drop the `tokens` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `currentRefreshToken` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentRefreshTokenExp` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tokens" DROP CONSTRAINT "tokens_intraId_fkey";

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "currentRefreshToken" TEXT NOT NULL,
ADD COLUMN     "currentRefreshTokenExp" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "tokens";
