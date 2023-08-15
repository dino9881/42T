import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MemberService } from 'src/member/member.service';
import { Socket } from 'socket.io';
import { Interval } from '@nestjs/schedule';
import {
  gameConstants,
  modeConstants,
  statusConstants,
} from 'src/util/constants';
import { GameRoom, GameProps } from './game.Interface';

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
    console.log('join-queue');
    const mem = this.queue.find((mem) => mem['intraId'] === member['intraId']);
    if (mem === undefined) {
      this.queue.push(member);
      await this.checkQueue();
    }
  }

  async checkQueue() {
    console.log('check-queue');
    while (this.queue.length >= 2) {
      const p1 = this.queue.shift();
      const p2 = this.queue.shift();
      //queue대기자는 normal mode
      await this.makeGame(p1, p2, modeConstants.NORMAL);
    }
  }

  async makeGame(p1: Socket, p2: Socket, mode: number) {
    console.log('makeGame');
    console.log('mode ' + mode);
    const roomName = 'G#' + p1['intraId'] + "$" + p2['intraId'];
    console.log('roomName ' + roomName);
    const payload = {
      player1: p1['nickName'],
      player2: p2['nickName'],
      roomName,
      mode,
    };
    p1.emit('game-ready', payload);
    p2.emit('game-ready', payload);
    this.memberService.updateStatus(p1['intraId'], statusConstants.IN_GAME);
    this.memberService.updateStatus(p2['intraId'], statusConstants.IN_GAME);
  }

  async enterGame(players: Socket[], roomName: string, mode: number) {
    console.log(players[0])
    console.log(roomName.substring(2,roomName.indexOf("$")));
    console.log(players[0]["intraId"]);
    this.gameRooms[roomName] = {
      player1 : (players[0]["intraId"] === roomName.substring(2,roomName.indexOf("$"))? players[0] : players[1]),
      player2:  (players[0]["intraId"] === roomName.substring(2,roomName.indexOf("$"))? players[1] : players[0]),
      gameProps: {
        ...gameConstants.GAMEPROPS,
        p1Score: 0,
        p2Score: 0,
        speed: gameConstants.BALL_SPEED,
      },
      mode: mode,
      finish: false,
    };
    console.log('startGame');
    console.log('mode ' + mode);
    //게임에 들어가는 순간 게임 큐에서 두명의 이름 삭제
    this.exitQueue(players[0]);
    this.exitQueue(players[1]);
  }

  async emitBothPlayer(gameRoom: GameRoom, message: string, payload: any) {
    gameRoom.player1.emit(message, payload);
    gameRoom.player2.emit(message, payload);
  }

  makeGameHistory(gameRoom: GameRoom) {
    if (gameRoom.gameProps.p1Score === 5) {
      return {
        winnerId: gameRoom.player1['intraId'],
        winnerScore: gameRoom.gameProps.p1Score,
        loserId: gameRoom.player2['intraId'],
        loserScore: gameRoom.gameProps.p2Score,
      };
    }
    return {
      winnerId: gameRoom.player2['intraId'],
      winnerScore: gameRoom.gameProps.p2Score,
      loserId: gameRoom.player1['intraId'],
      loserScore: gameRoom.gameProps.p1Score,
    };
  }

  async checkGameEnd(gameRoom: GameRoom, roomName: string) {
    if (this.gameRooms[roomName] === undefined || gameRoom.finish === true)
      return;
    if (gameRoom.gameProps.p1Score === 5 || gameRoom.gameProps.p2Score === 5) {
      gameRoom.finish = true;
      this.emitBothPlayer(gameRoom, 'game-end', {
        p1Score: gameRoom.gameProps.p1Score,
        p2Score: gameRoom.gameProps.p2Score,
      });
      const game = this.makeGameHistory(gameRoom);
      await this.addHistory(game);
      gameRoom.player1.leave(roomName);
      gameRoom.player2.leave(roomName);
      delete this.gameRooms[roomName];
    }
  }

  async playerExit(player: Socket, roomName: string) {
    console.log('playerExit');
    if (
      this.gameRooms[roomName] === undefined ||
      this.gameRooms[roomName].finish === true
    )
      return;
    const gameRoom = this.gameRooms[roomName];
    gameRoom.finish = true;
    if (gameRoom.player1['intraId'] === player['intraId']) {
      gameRoom.gameProps.p1Score = 0;
      gameRoom.gameProps.p2Score = 5;
    } else {
      gameRoom.gameProps.p1Score = 5;
      gameRoom.gameProps.p2Score = 0;
    }
    this.emitBothPlayer(gameRoom, 'game-sudden-end', {
      p1Score: gameRoom.gameProps.p1Score,
      p2Score: gameRoom.gameProps.p2Score,
    });
    const game = this.makeGameHistory(gameRoom);
    await this.addHistory(game);
    gameRoom.player1.leave(roomName);
    gameRoom.player2.leave(roomName);
    delete this.gameRooms[roomName];
  }

  async checkBallMove(gameRoom: GameRoom, roomName: string) {
    const dx = gameRoom.gameProps.ball.dx;
    const dy = gameRoom.gameProps.ball.dy;
    // ball의 다음위치
    const ballX = gameRoom.gameProps.ball.x + dx;
    const ballY = gameRoom.gameProps.ball.y + dy;
    // ball의 다음위치가 위아래 벽에 맞았는지 확인
    if (ballY < 5 || ballY > 600 - 5) gameRoom.gameProps.ball.dy = -dy;
    if (ballX < 5 || ballX > 1280 - 5) {
      // ball의 다음위치가 paddle에 맞았는지 확인
      if (
        ballX < 5 &&
        ballY > gameRoom.gameProps.y1 - 100 &&
        ballY < gameRoom.gameProps.y1 + 100
      ) {
        if (gameRoom.mode === modeConstants.NORMAL) {
          gameRoom.gameProps.ball.dx = -dx * 1.2;
        } else if (gameRoom.mode === modeConstants.EASY) {
          gameRoom.gameProps.ball.dx = -dx;
        }
        gameRoom.gameProps.ball.x = 5;
      } else if (
        ballX > 1280 - 5 &&
        ballY > gameRoom.gameProps.y2 - 100 &&
        ballY < gameRoom.gameProps.y2 + 100
      ) {
        // gameRoom.gameProps.speed *= 1.1;
        if (gameRoom.mode === modeConstants.NORMAL) {
          gameRoom.gameProps.ball.dx = -dx * 1.2;
        } else if (gameRoom.mode === modeConstants.EASY) {
          gameRoom.gameProps.ball.dx = -dx;
        }
        gameRoom.gameProps.ball.x = 1280 - 5;
      } else {
        console.log('someone lose');
        gameRoom.gameProps.ball.x = 640;
        gameRoom.gameProps.ball.y = 300;
        gameRoom.gameProps.ball.dx = 4;
        gameRoom.gameProps.ball.dy = -4;
        if (ballX > 1200) gameRoom.gameProps.p1Score += 1;
        else gameRoom.gameProps.p2Score += 1;
        // gameRoom Player들에게 점수 emit
        this.emitBothPlayer(gameRoom, 'game-score', {
          p1Score: gameRoom.gameProps.p1Score,
          p2Score: gameRoom.gameProps.p2Score,
        });
        this.checkGameEnd(gameRoom, roomName);
      }
    }
  }

  @Interval('gameRender', 15)
  async gameRender() {
    for (const roomName in this.gameRooms) {
      if (this.gameRooms.hasOwnProperty(roomName)) {
        const gameRoom = this.gameRooms[roomName];
        // calculate gameProps
        this.checkBallMove(gameRoom, roomName);
        gameRoom.gameProps.ball.x += gameRoom.gameProps.ball.dx;
        gameRoom.gameProps.ball.y += gameRoom.gameProps.ball.dy;
        // update gameRoom gameProps
        const { ball, p1Score, p2Score, speed, ...gameProps }: GameProps = gameRoom.gameProps;
        this.emitBothPlayer(gameRoom, 'game-render', {
          ...gameProps,
          bx: ball.x,
          by: ball.y,
        });
      }
    }
  }

  async checkLimit(gameProps: GameProps) {
    if (gameProps.y1 > 500) gameProps.y1 = 500;
    if (gameProps.y1 < 100) gameProps.y1 = 100;
    if (gameProps.y2 > 500) gameProps.y2 = 500;
    if (gameProps.y2 < 100) gameProps.y2 = 100;
  }

  async playerW(player: Socket, roomName: string) {
    console.log('gameservice - playerW');
    //game render
    console.log("player1");
    console.log(this.gameRooms[roomName].player1['intraId']);
    console.log("player2");
    console.log(this.gameRooms[roomName].player2['intraId']);
    if (this.gameRooms[roomName].player1['intraId'] === player['intraId']) {
      console.log(player['intraId'] + "player1");
      this.gameRooms[roomName].gameProps.y1 -= 40;
    } else {
      console.log(player['intraId'] + "player2");
      this.gameRooms[roomName].gameProps.y2 -= 40;
    }
    this.checkLimit(this.gameRooms[roomName].gameProps);
  }

  async playerS(player: Socket, roomName: string) {
    console.log('gameservice - playerS');
    //game render
    if (this.gameRooms[roomName].player1['intraId'] === player['intraId']) {
      console.log(player['intraId'] + "player1");
      this.gameRooms[roomName].gameProps.y1 += 40;
    } else {
      console.log(player['intraId'] + "player2");
      this.gameRooms[roomName].gameProps.y2 += 40;
    }
    this.checkLimit(this.gameRooms[roomName].gameProps);
  }

  async exitQueue(member: Socket) {
    console.log('exit-queue');
    this.queue = this.queue.filter(
      (mem) => mem['intraId'] != member['intraId'],
    );
  }

  checkRoomName(roomName: string) {
    if (
      this.gameRooms[roomName] === undefined ||
      this.gameRooms[roomName].finish === true
    )
      return false;
    return true;
  }
}
