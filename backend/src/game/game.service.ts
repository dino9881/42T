import { HttpException, Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { PrismaService } from 'src/prisma.service';
import { MemberService } from 'src/member/member.service';

@Injectable()
export class GameService {
  constructor(
    private prisma: PrismaService,
    private memberService: MemberService,
  ) {}

  async addHistory(game: CreateGameDto) {
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
    //member rank 업데이트하기
    //winner : +5
    await this.memberService.updateRank(game.winnerId, 5);
    //loser : +3
    await this.memberService.updateRank(game.loserId, 3);
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
    return {
      length: games.length,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      data: games.map(({ gameIdx, ...gameDetail }) => gameDetail),
    };
  }
}
