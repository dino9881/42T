import {
  WebSocketServer,
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChannelService } from './channel/channel.service';
import { Injectable, UseGuards } from '@nestjs/common';
import { MemberService } from './member/member.service';
import { GameService } from './game/game.service';
import { WsGuard } from './auth/ws.guard';

interface Payload {
  channelName: string;
  intraId: string;
  nickName: string;
  message: string;
  avatar: string;
  text: string;
  player1: string;
  player2: string;
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class SocketIOGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  constructor(
    private readonly channelService: ChannelService,
    private readonly memberService: MemberService,
    private readonly gameService: GameService,
    private socketList: Map<string, Socket>,
  ) {
    this.socketList = new Map<string, Socket>();
  }

  afterInit() {
    console.log('웹소켓 서버 초기화 완료');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    console.log(`${socket.id} 소켓 연결`);
    socket['nickname'] = 'anon';
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log(`${socket.id}, ${socket['intraId']} 소켓 연결 끝`);
    // 현재 소켓에 들어있는 intraId값이 없음
    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.leave(room);
      }
    });
    if (socket['intraId']) {
      this.memberService.updateStatus(socket['intraId'], 0); // 0 : offline
      this.socketList.delete(socket['intraId']);
    }
  }

  getSocketByintraId(intraId: string): Socket | undefined {
    return this.socketList.get(intraId);
  }

  // @UseGuards(WsGuard)
  @SubscribeMessage('member-info')
  handleMemberInfo(client: Socket, payload: Payload) {
    const { intraId, nickName } = payload;
    // if (this.socketList.has(intraId)) this.socketList.set(intraId, client);
    client['intraId'] = intraId;
    client['nickName'] = nickName;
    this.memberService.updateStatus(intraId, 1); // 1 : online
    console.log(`${nickName}(${intraId}) 님이 접속하셨습니다.`);
    this.socketList.set(intraId, client);
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: Payload): Promise<string> {
    const { channelName, nickName, message, avatar } = payload;
    // mute check
    const ismuted = await this.channelService.ismuted(channelName, nickName);
    if (ismuted)
      return 'Message received! But you are muted. You cannot send message.';
    client.to(channelName).emit('send-message', { nickName, message, avatar });
    this.channelService.sendMessage(channelName, nickName, message, avatar);
    return 'Message received!';
  }

  @SubscribeMessage('enter-channel')
  async handleChannelEnter(client: Socket, payload: Payload) {
    const { channelName, nickName } = payload;
    const isChanUsers = await this.channelService.isChanUsers(
      channelName,
      nickName,
    );
    if (!isChanUsers) client.to(channelName).emit('welcome', nickName);
    client.join(channelName);
    client['nickName'] = nickName;
    console.log(`${nickName} enter channel : ${channelName}`);
  }

  @SubscribeMessage('leave-channel')
  async handleChannelLeave(client: any, payload: any) {
    const { channelName, nickName } = payload;
    client.leave(channelName);
    console.log(`${nickName} leave channel : ${channelName}`);
  }

  @SubscribeMessage('game-queue-join')
  handleGameQueueJoin(client: Socket, payload: Payload) {
    const { intraId, nickName } = payload;
    client['intraId'] = intraId;
    client['nickName'] = nickName;
    console.log(`${nickName}(${intraId}) 님이 게임 큐에 들어왔습니다.`);
    this.gameService.joinQueue(client);
  }

  @SubscribeMessage('game-queue-exit')
  handleGameQueueExit(client: Socket, payload: Payload) {
    const { intraId, nickName } = payload;
    client['intraId'] = intraId;
    client['nickName'] = nickName;
    console.log(`${nickName}(${intraId}) 님이 게임 큐에서 나갔습니다.`);
    this.gameService.exitQueue(client);
  }

  @SubscribeMessage('game-start')
  handleGameStart(client: Socket, payload: Payload) {
    const { intraId, nickName } = payload;
    client['intraId'] = intraId;
    client['nickName'] = nickName;
    console.log(`${nickName}(${intraId}) 님이 게임을 시작했습니다.`);
  }

  @SubscribeMessage('game-apply')
  async handleGameApply(client: Socket, payload: Payload) {
    const { intraId, nickName, player2 } = payload;
    client['intraId'] = intraId;
    client['nickName'] = nickName;
    try {
      const p2 = await this.memberService.getOneByNick(player2);
      const p2socket = this.socketList.get(p2.intraId);
      if (p2socket === undefined) {
        this.playerNotFoundEmitError(client, player2);
        return;
      }
      p2socket.emit('game-apply', { nickName: nickName }); // 게임 수락/거절 화면을 뜨워야함. 프론트에서 처리
      console.log(
        `${nickName}(${intraId}) 님이 ${player2}님과의 게임을 요청했습니다.`,
      );
    } catch (error) {
      this.playerNotFoundEmitError(client, player2);
    }
  }

  //p2가 게임을 수락했을 때
  @SubscribeMessage('game-accept')
  async handleGameAccept(client: Socket, payload: Payload) {
    const { intraId, nickName, player1 } = payload; // player1 : nickname
    client['intraId'] = intraId;
    client['nickName'] = nickName;
    try {
      const p1 = await this.memberService.getOneByNick(player1);
      const p1socket = this.socketList.get(p1.intraId);
      if (p1socket === undefined) {
        this.playerNotFoundEmitError(client, player1);
        return;
      }
      this.gameService.makeGame(client, p1socket);
    } catch (error) {
      this.playerNotFoundEmitError(client, player1);
    }
  }

  //p2가 게임을 거절했을 때
  @SubscribeMessage('game-reject')
  async handleGameReject(client: Socket, payload: Payload) {
    const { intraId, nickName, player1 } = payload;
    client['intraId'] = intraId;
    client['nickName'] = nickName;
    try {
      const p1 = await this.memberService.getOneByNick(player1);
      const p1socket = this.socketList.get(p1.intraId);
      if (p1socket === undefined) {
        this.playerNotFoundEmitError(client, player1);
        return;
      }
      p1socket.emit('game-reject', { nickName: nickName });
    } catch (error) {
      this.playerNotFoundEmitError(client, player1);
    }
  }

  playerNotFoundEmitError(client: Socket, nickName: string) {
    console.log(`${nickName}님이 존재하지 않습니다.`);
    client.emit('game-oppo-not-found', { nickName: nickName });
  }
}
