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

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
})
export class SocketIOGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  afterInit() {
    console.log('웹소켓 서버 초기화 완료');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    // login시 connect되도록 변경
    // socket 연결시 member intraId socket에 담기
    console.log(`${socket.id} 소켓 연결`);
    socket['nickname'] = 'anon';
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    // socket 연결 해제시 member status 0으로 변경
    console.log(`${socket.id} 소켓 연결 끝`);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    const { channelname, nickname, text } = payload;
    client.to(channelname).emit('send-message', { nickname, text });
    return 'Message received!';
  }

  @SubscribeMessage('enter-channel')
  handleChannelEnter(client: any, payload: any) {
    const { channelName, nickname } = payload;
    client.join(channelName);
    client['nickname'] = nickname;
    // nickname 변경 된 뒤에 이 닉네임이 변경되고 있는지 확인해야함
    console.log(`${nickname} enter channel : ${channelName}`);
    client.to(channelName).emit('welcome', nickname);
  }
}
