import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MemberService } from 'src/member/member.service';
import { Socket } from 'socket.io';
import { Interval } from '@nestjs/schedule';
interface GameProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  bx: number;
  by: number;
}

interface GameRoom {
  player1: Socket;
  player2: Socket;
  gameProps: GameProps;
  mode: number;
}

@Injectable()
export class GameService {
  constructor(
    private prisma: PrismaService,
    private memberService: MemberService,
  ) {
    this.queue = [];
    this.gameRooms = {};
  }
  private queue: Socket[];
  private gameRooms: Record<string, GameRoom>;

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
    if (mem == undefined) {
      this.queue.push(member);
      await this.checkQueue();
    }
  }

  async checkQueue() {
    console.log('check-queue');
    while (this.queue.length >= 2) {
      const p1 = this.queue.shift();
      const p2 = this.queue.shift();
      await this.makeGame(p1, p2, 1);
      //queue대기자는 normal mode
    }
  }

  async makeGame(p1: Socket, p2: Socket, mode: number) {
    console.log('makeGame');
    console.log(mode);
    const roomName = 'G#' + p1['intraId'] + p2['intraId'];
    console.log(roomName);
    const payload = {
      player1: p1['nickName'],
      player2: p2['nickName'],
      roomName,
      mode,
    };
    p1.emit('game-ready', payload);
    p2.emit('game-ready', payload);
    this.memberService.updateStatus(p1['intraId'], 2); // 2: 게임중
    this.memberService.updateStatus(p2['intraId'], 2);
  }

  async enterGame(players: Socket[], roomName: string, mode: number) {
    //실제로 paddle의 움직임, ball의 움직임을 계산하고,
    //player에게 전달해야함.
    this.gameRooms[roomName] = {
      player1: players[0],
      player2: players[1],
      gameProps: { x1: 10, y1: 300, x2: 1270, y2: 300, bx: 300, by: 300 },
      mode: mode,
    };
    console.log('startGame');
    console.log(mode);
  }

  @Interval('gameRender', 100)
  async gameRender() {
    for (const roomName in this.gameRooms) {
      if (this.gameRooms.hasOwnProperty(roomName)) {
        const gameRoom = this.gameRooms[roomName];
        console.log(gameRoom.gameProps);
        // calculate gameProps

        // update gameRoom gameProps
        // const gameProps: GameProps = gameRoom.gameProps;
        // gameRoom.player1.emit('game-render', gameProps);
        // gameRoom.player2.emit('game-render', gameProps);
      }
    }
  }

  async playerW(player: Socket, roomName: string) {
    console.log('gameservice - playerW');
    //game render
    if (this.gameRooms[roomName].player1['intraId'] == player['intraId']) {
      console.log(player['intraId']);
      this.gameRooms[roomName].gameProps.bx = 670;
    } else {
      console.log(player['intraId']);
      this.gameRooms[roomName].gameProps.bx = 670;
    }
  }

  // paddle bar를 움직일 때만 렌더링하는게 아니라,
  // 움직이고 있지 않을때도 렌더링 되어야함.
  async playerS(player: Socket, roomName: string) {
    console.log('gameservice - playerS');
    //game render
    if (this.gameRooms[roomName].player1['intraId'] == player['intraId']) {
      console.log(player['intraId']);
      this.gameRooms[roomName].gameProps.by = 670;
    } else {
      console.log(player['intraId']);
      this.gameRooms[roomName].gameProps.by = 670;
    }
  }

  async exitQueue(member: Socket) {
    console.log('exit-queue');
    this.queue = this.queue.filter(
      (mem) => mem['intraId'] != member['intraId'],
    );
  }
}
