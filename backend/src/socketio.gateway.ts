import { WebSocketServer, ConnectedSocket, SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import {Socket} from 'socket.io';

@WebSocketGateway({
  cors:{
    origin:['http://localhost:3000'],
  } 
})
export class SocketIOGateway implements OnGatewayInit, OnGatewayConnection,OnGatewayDisconnect{
  @WebSocketServer() server : Socket;
  
  afterInit(){
    console.log("웹소켓 서버 초기화 완료");
  }
  
  handleConnection(@ConnectedSocket() socket:Socket){
      console.log(`${socket.id} 소켓 연결`);
  }
  
  handleDisconnect(@ConnectedSocket() socket:Socket){
    console.log(`${socket.id} 소켓 연결 끝`);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log('Received message:', payload);
    return 'Message received!';
  }
}
