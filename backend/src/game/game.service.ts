import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MemberService } from 'src/member/member.service';
import { MemberInfoDto } from 'src/member/dto/member-info.dto';
import { HttpStatusCode } from 'axios';
import { Socket } from 'socket.io';

@Injectable()
export class GameService {
  constructor(
    private prisma: PrismaService,
    private memberService: MemberService,
  ) {
    this.queue = [];
  }
  private queue: Socket[];

  async addHistory(game: CreateGameDto) {
    if (game.winnerId == game.loserId)
      throw new ConflictException('P1 and P2 are same Member');
    await this.memberService.getOne(game.winnerId);
    await this.memberService.getOne(game.loserId);
    if (game.winnerScore < game.loserScore) {
      throw new HttpException(
        'winnerScore must be bigger than loserScore',
        416,
      );
    }
    await this.prisma.gameHistory.create({ data: game });
    await this.memberService.updateRank(game.winnerId, 5);
    await this.memberService.updateWinCnt(game.winnerId);
    await this.memberService.updateStatus(game.winnerId, 1);
    await this.memberService.updateRank(game.loserId, 3);
    await this.memberService.updateLoseCnt(game.loserId);
    await this.memberService.updateStatus(game.loserId, 1);
    return;
  }

  async findGamesByIntraId(intraId: string) {
    await this.memberService.getOne(intraId);
    const games = await this.prisma.gameHistory.findMany({
      where: {
        OR: [{ winnerId: intraId }, { loserId: intraId }],
      },
      orderBy: { gameIdx: 'desc' },
      take: 5,
    });
    return games;
  }

  async joinQueue(member: Socket) {
    const mem = this.queue.find((mem) => mem['intraId'] == member['intraId']);
    console.log('join-queue');
    // console.log(mem);
    // console.log(this.queue);
    if (mem == undefined) {
      this.queue.push(member);
      await this.checkQueue();
      // console.log(this.queue);
    }
  }

  async checkQueue() {
    console.log('check-queue');
    while (this.queue.length >= 2) {
      // console.log('while inside');
      const p1 = this.queue.shift();
      const p2 = this.queue.shift();
      await this.makeGame(p1, p2);
    }
  }

  async makeGame(p1: Socket, p2: Socket) {
    console.log('makeGame');
    p1.emit('game-ready', { player1: p1['nickName'], player2: p2['nickName'] });
    p2.emit('game-ready', { player1: p1['nickName'], player2: p2['nickName'] });
    // p1.join('game-room' + p1['intraId'] + p2['intraId']); // 방 이름 정해야함
    this.memberService.updateStatus(p1['intraId'], 2); // 2: 게임중
    this.memberService.updateStatus(p2['intraId'], 2);
  }

  async exitQueue(member: Socket) {
    this.queue = this.queue.filter(
      (mem) => mem['intraId'] != member['intraId'],
    );
    console.log(this.queue);
  }
}
