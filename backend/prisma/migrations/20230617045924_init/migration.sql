-- CreateTable
CREATE TABLE "Member" (
    "intraId" TEXT NOT NULL,
    "nickName" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "currentRefreshTokenExp" TIMESTAMP(3),
    "currentRefreshToken" TEXT,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("intraId")
);

-- CreateTable
CREATE TABLE "Friend" (
    "friendIdx" SERIAL NOT NULL,
    "memberId" TEXT NOT NULL,
    "friendId" TEXT NOT NULL,

    CONSTRAINT "Friend_pkey" PRIMARY KEY ("friendIdx")
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
CREATE TABLE "MemberBan" (
    "memberBanIdx" SERIAL NOT NULL,
    "memberId" TEXT NOT NULL,
    "banId" TEXT NOT NULL,

    CONSTRAINT "MemberBan_pkey" PRIMARY KEY ("memberBanIdx")
);

-- CreateTable
CREATE TABLE "GameHistory" (
    "gameIdx" SERIAL NOT NULL,
    "gameP1Id" TEXT NOT NULL,
    "gameP2Id" TEXT NOT NULL,
    "gameP1Score" INTEGER NOT NULL,
    "gameP2Score" INTEGER NOT NULL,

    CONSTRAINT "GameHistory_pkey" PRIMARY KEY ("gameIdx")
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_nickName_key" ON "Member"("nickName");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_chName_key" ON "Channel"("chName");

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("intraId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "Member"("intraId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "Member"("intraId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberBan" ADD CONSTRAINT "MemberBan_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("intraId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberBan" ADD CONSTRAINT "MemberBan_banId_fkey" FOREIGN KEY ("banId") REFERENCES "Member"("intraId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameHistory" ADD CONSTRAINT "GameHistory_gameP1Id_fkey" FOREIGN KEY ("gameP1Id") REFERENCES "Member"("intraId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameHistory" ADD CONSTRAINT "GameHistory_gameP2Id_fkey" FOREIGN KEY ("gameP2Id") REFERENCES "Member"("intraId") ON DELETE RESTRICT ON UPDATE CASCADE;
