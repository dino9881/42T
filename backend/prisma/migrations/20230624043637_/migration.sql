-- CreateTable
CREATE TABLE "Member" (
    "intraId" TEXT NOT NULL,
    "nickName" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "winCnt" INTEGER NOT NULL DEFAULT 0,
    "loseCnt" INTEGER NOT NULL DEFAULT 0,
    "currentRefreshTokenExp" TIMESTAMP(3),
    "currentRefreshToken" TEXT,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("intraId")
);

-- CreateTable
CREATE TABLE "Channel" (
    "chIdx" SERIAL NOT NULL,
    "chName" TEXT NOT NULL,
    "chPwd" TEXT,
    "chUserCnt" INTEGER,
    "operatorId" TEXT NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("chIdx")
);

-- CreateTable
CREATE TABLE "GameHistory" (
    "gameIdx" SERIAL NOT NULL,
    "winnerId" TEXT NOT NULL,
    "loserId" TEXT NOT NULL,
    "winnerScore" INTEGER NOT NULL,
    "loserScore" INTEGER NOT NULL,

    CONSTRAINT "GameHistory_pkey" PRIMARY KEY ("gameIdx")
);

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
CREATE UNIQUE INDEX "Member_nickName_key" ON "Member"("nickName");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_chName_key" ON "Channel"("chName");

-- CreateIndex
CREATE UNIQUE INDEX "_friend_AB_unique" ON "_friend"("A", "B");

-- CreateIndex
CREATE INDEX "_friend_B_index" ON "_friend"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ban_AB_unique" ON "_ban"("A", "B");

-- CreateIndex
CREATE INDEX "_ban_B_index" ON "_ban"("B");

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "Member"("intraId") ON DELETE RESTRICT ON UPDATE CASCADE;

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
