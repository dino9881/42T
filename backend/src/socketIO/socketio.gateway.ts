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
import { ChannelService } from '../channel/channel.service';
import {
  Injectable,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MemberService } from '../member/member.service';
import { GameService } from '../game/game.service';
import { WsGuard } from '../auth/ws.guard';
import { ConflictExceptionFilter } from './ConflictExceptionFilter';

interface Payload {
  channelName: string;
  intraId: string;
  nickName: string;
  message: string;
  avatar: string;
  text: string;
  player1: string;
  player2: string;
  mode: number; // 0 : easy, 1 : normal, 2: hard
  password: string;
  chIdx: number;
}

@Injectable()
@WebSocketGateway(
  // 5002,
  {
    cors: {
      origin: 'http://localhost:3000',
    },
  },
)
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
  // @UsePipes(new ValidationPipe())
  @SubscribeMessage('member-info')
  handleMemberInfo(client: Socket, payload: Payload) {
    const { intraId, nickName, avatar } = payload;
    // if (this.socketList.has(intraId)) this.socketList.set(intraId, client);
    client['intraId'] = intraId;
    client['nickName'] = nickName;
    client['avatar'] = avatar;
    this.memberService.updateStatus(intraId, 1); // 1 : online
    console.log(`${nickName}(${intraId}) 님이 접속하셨습니다.`);
    this.socketList.set(intraId, client);
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: Payload): Promise<string> {
    const { channelName, nickName, message, avatar } = payload;
    // mute check
    if (await this.channelService.ismuted(channelName, nickName)) {
      this.getSocketByintraId(client['intraId'])?.emit('mute');
      return 'Message received! But you are muted. You cannot send message.';
    }
    if (await this.channelService.isBan(channelName, client['intraId']))
      return 'Message received! But you are banned.';
    const user = await this.channelService.isFirstMessage(
      channelName,
      client['intraId'],
    );
    if (user !== '')
      this.getSocketByintraId(user)?.emit('send-dm', client['intraId']);
    client.to(channelName).emit('send-message', { nickName, message, avatar });
    this.channelService.sendMessage(channelName, nickName, message, avatar);
    return 'Message received!';
  }

  @SubscribeMessage('enter-channel')
  async handleChannelEnter(client: Socket, payload: Payload) {
    const { channelName, nickName } = payload;
    // const isChanUsers = await this.channelService.isChanUsers(
    //   channelName,
    //   nickName,
    // );
    // if (!isChanUsers) client.to(channelName).emit('welcome', nickName);
    client.join(channelName);
    client['nickName'] = nickName;
    console.log(`${nickName} enter channel : ${channelName}`);
  }

  @SubscribeMessage('leave-channel')
  async handleChannelLeave(client: any, payload: any) {
    const { channelName, chIdx, nickName } = payload;
    client.leave(channelName);
    if (this.channelService.leave(chIdx, client['intraId'])) {
      const members = await this.memberService.getAll();
      members.map(users => {
        if (users.intraId !== "admin")
        this.getSocketByintraId(users.intraId)?.emit("reload");
      });
    }
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
    const { intraId, nickName, player2, mode } = payload;
    client['intraId'] = intraId;
    client['nickName'] = nickName;
    if (mode !== 0 && mode !== 1 && mode !== 2) {
      client.emit('game-mode-error', { mode });
      return;
    }
    try {
      const p2 = await this.memberService.getOneByNick(player2);
      const p2socket = this.socketList.get(p2.intraId);
      if (p2socket === undefined) {
        this.playerNotFoundEmitError(client, player2);
        return;
      }
      p2socket.emit('game-apply', { nickName: nickName, mode: mode }); // 게임 수락/거절 화면을 뜨워야함. 프론트에서 처리
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
    const { intraId, nickName, player1, mode } = payload; // player1 : nickname
    client['intraId'] = intraId;
    client['nickName'] = nickName;
    if (mode !== 0 && mode !== 1 && mode !== 2) {
      client.emit('game-mode-error', { mode });
      return;
    }
    try {
      const p1 = await this.memberService.getOneByNick(player1);
      const p1socket = this.socketList.get(p1.intraId);
      if (p1socket === undefined) {
        this.playerNotFoundEmitError(client, player1);
        return;
      }
      this.gameService.makeGame(client, p1socket, mode);
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


  // 일반채널 생성
  @UseFilters(ConflictExceptionFilter)
  @SubscribeMessage('create-channel')
  async handleChannelCreate(client: Socket, payload: Payload) {
    const { channelName, password, } = payload;
    try {
      const channel = await this.channelService.create(
        {
          intraId: client['intraId'],
          nickName: client['nickName'],
          avatar: client['avatar'],
        },
        { chName: channelName, chPwd: password, },
      );
      client.emit('new-channel', { chIdx: channel.chIdx });
      const members = await this.memberService.getAll();
      members.map((users) => {
        if (users.intraId !== 'admin')
          this.getSocketByintraId(users.intraId)?.emit('reload');
      });
    } catch (error) {
      if (error.response.statusCode === 409) client.emit('duplicate-chanName');
      else if (error.response.statusCode === 403) client.emit('max-channel');
      else client.emit('server-error');
    }
  }

  // invite
  @UseFilters(ConflictExceptionFilter)
  @SubscribeMessage('channel-invite')
  async handleChannelInvite(client: Socket, payload: Payload) {
    const { channelName, intraId } = payload;
    try {
      const user = this.getSocketByintraId(intraId);
      this.channelService.channelInvite(channelName, {intraId: user['intraId'], avatar: user['avatar'] ,nickName: user['nickName']});
      // nickName 님이 channelName 에 초대하셨습니다 이런거
      user?.emit('invite', client['nickName'], channelName);
    } catch (error) {
      if (error.response && error.response.statusCode === 403)
        client.emit('max-capacity');
      else client.emit('server-error');
    }
  }

  // 채널 kick, ban, mute, admin
  @UseFilters(ConflictExceptionFilter)
  @SubscribeMessage('channel-kick')
  async handleChannelKick(client: Socket, payload: Payload) {
    const { chIdx, intraId } = payload;
    try {
      await this.channelService.kick(chIdx, client['intraId'], {
        intraId: intraId,
        nickName: '',
        avatar: '',
      });
      this.getSocketByintraId(intraId)?.emit('kick');
    } catch (error) {
      if (error.response && error.response.statusCode === 403)
        client.emit('no-permissions');
      else client.emit('server-error');
    }
  }

  @UseFilters(ConflictExceptionFilter)
  @SubscribeMessage('channel-ban')
  async handleChannelBan(client: Socket, payload: Payload) {
    const { chIdx, intraId } = payload;
    try {
      await this.channelService.saveBanUser(chIdx, client['intraId'], {
        intraId: intraId,
        nickName: '',
        avatar: '',
      });
      this.getSocketByintraId(intraId)?.emit('ban');
    } catch (error) {
      if (error.response && error.response.statusCode === 403)
        client.emit('no-permissions');
      else client.emit('server-error');
    }
  }

  @UseFilters(ConflictExceptionFilter)
  @SubscribeMessage('channel-mute')
  async handleChannelMute(client: Socket, payload: Payload) {
    const { chIdx, intraId, nickName } = payload;
    try {
      await this.channelService.muteUser(chIdx, client['intraId'], {
        intraId: intraId,
        nickName: nickName,
        avatar: '',
      });
      this.getSocketByintraId(intraId)?.emit('mute');
    } catch (error) {
      if (error.response && error.response.statusCode === 403)
        client.emit('no-permissions');
      else client.emit('server-error');
    }
  }

  @UseFilters(ConflictExceptionFilter)
  @SubscribeMessage('channel-admin')
  async handleChannelAdmin(client: Socket, payload: Payload) {
    const { chIdx, intraId } = payload;
    try {
      await this.channelService.setAdmin(chIdx, client['intraId'], {
        intraId: intraId,
        nickName: '',
        avatar: '',
      });
      this.getSocketByintraId(intraId)?.emit('admin');
    } catch (error) {
      if (error.response && error.response.statusCode === 403)
        client.emit('no-permissions');
      else client.emit('server-error');
    }
  }
}
