import {
  WebSocketServer,
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChannelService } from './channel/channel.service';
import { Injectable } from '@nestjs/common';
import { MemberService } from './member/member.service';
import { GameService } from './game/game.service';

interface Payload {
  channelName: string;
  intraId: string;
  nickName: string;
  message: string;
  avatar: string;
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
})
export class SocketIOGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  constructor(
    private readonly channelService: ChannelService,
    private readonly memberService: MemberService,
    private readonly gameService: GameService, // private socketList: Map<string, Socket>,
  ) {
    // socketList = {} as Map<string, Socket>;
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
    if (socket['intraId'])
      this.memberService.updateStatus(socket['intraId'], 0); // 0 : offline
  }

  // getSocketByintraId(intraId: string): Socket | undefined {
  // return this.socketList.get(intraId);
  // }

  @SubscribeMessage('memberInfo')
  handleMemberInfo(client: Socket, payload: Payload) {
    const { intraId, nickName } = payload;
    // if (this.socketList.has(intraId)) this.socketList.set(intraId, client);
    client['intraId'] = intraId;
    client['nickName'] = nickName;
    this.memberService.updateStatus(intraId, 1); // 1 : online
    console.log(`${nickName}(${intraId}) 님이 접속하셨습니다.`);
    // this.socketList.set(intraId, client);
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
}
