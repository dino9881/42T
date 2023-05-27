-- AlterTable
ALTER TABLE "Member" ALTER COLUMN "currentRefreshToken" DROP NOT NULL,
ALTER COLUMN "currentRefreshTokenExp" DROP NOT NULL;
