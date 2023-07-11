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
  text: string;
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
    private readonly gameService: GameService,
  ) {}

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

  @SubscribeMessage('memberInfo')
  handleMemberInfo(client: Socket, payload: Payload) {
    const { intraId, nickName } = payload;
    client['intraId'] = intraId;
    client['nickName'] = nickName;
    this.memberService.updateStatus(intraId, 1); // 1 : online
    console.log(`${nickName}(${intraId}) 님이 접속하셨습니다.`);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: Payload): string {
    const { channelName, nickName, text } = payload;
    client.to(channelName).emit('send-message', { nickName, text });
    this.channelService.sendMessage(channelName, nickName, text);
    return 'Message received!';
  }

  @SubscribeMessage('enter-channel')
  handleChannelEnter(client: Socket, payload: Payload) {
    const { channelName, nickName } = payload;
    client.join(channelName);
    client['nickName'] = nickName;
    console.log(`${nickName} enter channel : ${channelName}`);
    client.to(channelName).emit('welcome', nickName);
  }

  @SubscribeMessage('game-queue')
  handleGameQueue(client: Socket, payload: Payload) {
    const { intraId, nickName } = payload;
    console.log(`${nickName}(${intraId}) 님이 게임 큐에 들어왔습니다.`);
    this.gameService.joinQueue(client);
  }
}
