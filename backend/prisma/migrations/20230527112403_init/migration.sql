-- CreateTable
CREATE TABLE "tokens" (
    "id" TEXT NOT NULL,
    "intraId" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_intraId_fkey" FOREIGN KEY ("intraId") REFERENCES "Member"("intraId") ON DELETE CASCADE ON UPDATE CASCADE;