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
      socket["nickname"] = "anon";
  }
  
  handleDisconnect(@ConnectedSocket() socket:Socket){
    console.log(`${socket.id} 소켓 연결 끝`);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    const {channelname, nickname, text} =payload;
    client.to(channelname).emit("send-message", {nickname, text});
    return 'Message received!';
  }

  @SubscribeMessage('enter-channel')
  handleChannelEnter(client:any, payload:any) {
    const {channelName, nickname} = payload;
    client.join(channelName);
    client["nickname"] = nickname;
    client.to(channelName).emit("welcome", nickname);
  }
  private x1: number = 10;
  private y1 = 360;
  private x2 = 1270;
  private y2 = 360;
  private bx = 640;
  private by = 360;

  @SubscribeMessage('game-start')
  handleGameStart(client: any, payload: any): string {
    console.log('game-start', payload);
    setInterval(() => {
      client.emit("game-render",{x1: this.x1, y1: this.y1, x2: this.x2, y2 : this.y2, bx : this.bx, by:this.by});
    }, 100); 
    return 'Message received!';
  }
  
  @SubscribeMessage('player1-w')
  handlePlayer1W(client: any, payload: any): string {
    if (this.y1 >= 120)
    this.y1 -= 20;
    return 'Message received!';
  }

  @SubscribeMessage('player1-s')
  handlePlayer1S(client: any, payload: any): string {
    if(this.y1 <= 600)
    this.y1 += 20;
    return 'Message received!';
  }

  @SubscribeMessage('player2-w')
  handlePlayer2W(client: any, payload: any): string {
    if (this.y2 >= 120)
    this.y2 -= 20;
    return 'Message received!';
  }

  @SubscribeMessage('player2-s')
  handlePlayer2S(client: any, payload: any): string {
    if(this.y2 <= 600)
    this.y2 += 20;
    return 'Message received!';
  }
}
