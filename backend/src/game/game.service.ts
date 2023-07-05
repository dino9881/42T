import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MemberService } from 'src/member/member.service';
import { MemberInfoDto } from 'src/member/dto/member-info.dto';
import { HttpStatusCode } from 'axios';

@Injectable()
export class GameService {
  constructor(
    private prisma: PrismaService,
    private memberService: MemberService,
  ) {
    this.queue = [];
  }
  private queue: MemberInfoDto[];

  async addHistory(game: CreateGameDto) {
    if (game.winnerId == game.loserId)
      throw new ConflictException('P1 and P2 are same Member');
    // id1 , id2 가 있는 멤버인지 확인
    await this.memberService.getOne(game.winnerId);
    await this.memberService.getOne(game.loserId);
    // winnerScore가 loserScore보다 큰지 확인
    if (game.winnerScore < game.loserScore) {
      throw new HttpException(
        'winnerScore must be bigger than loserScore',
        416,
      );
    }
    // gamehistory db 접근
    await this.prisma.gameHistory.create({
      data: game,
    });
    //member rank 및 전적 업데이트하기
    //winner : +5
    await this.memberService.updateRank(game.winnerId, 5);
    await this.memberService.updateWinCnt(game.winnerId);
    await this.memberService.updateStatus(game.winnerId, 1);
    //loser : +3
    await this.memberService.updateRank(game.loserId, 3);
    await this.memberService.updateLoseCnt(game.loserId);
    await this.memberService.updateStatus(game.loserId, 1);

    return;
  }

  async findGamesByIntraId(intraId: string) {
    //intraId가 있는 멤버인지 확인
    await this.memberService.getOne(intraId);
    //gamehistory db 접근 : 5개 가져오기
    const games = await this.prisma.gameHistory.findMany({
      where: {
        OR: [{ winnerId: intraId }, { loserId: intraId }],
      },
      orderBy: {
        gameIdx: 'desc',
      },
      take: 5,
    });
    //총 개수, 데이터를 리턴
    return games;
  }

  async joinQueue(member: MemberInfoDto) {
    const mem = this.queue.find((mem) => mem.intraId == member.intraId);
    if (mem == undefined) {
      this.queue.push(member);
      await this.checkQueue();
      console.log(this.queue);
      return HttpStatusCode.Ok;
    }
    throw new ConflictException('Same member already exist in queue');
  }

  async checkQueue() {
    while (this.queue.length >= 2) {
      const p1 = this.queue.shift();
      const p2 = this.queue.shift();
      await this.makeGame(p1, p2);
    }
    console.log(this.queue);
    return HttpStatusCode.Ok;
  }

  async makeGame(p1: MemberInfoDto, p2: MemberInfoDto) {
    console.log('makeGame');
    // game 화면으로 바꿔야함. 어떻게 하지?
    // 소켓을 미리 받아놓고, socket에 game방 아이디를 주면
    // front에서 게임화면으로 nav 가능
    this.memberService.updateStatus(p1.intraId, 2);
    this.memberService.updateStatus(p2.intraId, 2);
    return;
  }

  async exitQueue(member: MemberInfoDto) {
    this.queue = this.queue.filter((mem) => mem.intraId != member.intraId);
    console.log(this.queue);
    return HttpStatusCode.Ok;
  }
}
