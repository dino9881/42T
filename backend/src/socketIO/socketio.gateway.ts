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
import { modeConstants, statusConstants, memberConstants } from 'src/util/constants';

interface Payload {
  channelName: string;
  intraId: string;
  nickName: string;
  message: string;
  avatar: string;
  text: string;
  player1: string;
  player2: string;
  roomName: string;
  mode: number;
  password: string;
  chIdx: number;
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: `http://${process.env.HOST}:3000`,
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
    socket['nickName'] = 'anon';
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
      this.memberService.updateStatus(
        socket['intraId'],
        statusConstants.OFFLINE,
      );
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
    this.memberService.updateStatus(intraId, statusConstants.ONLINE); // 1 : online
    console.log(`${nickName}(${intraId}) 님이 접속하셨습니다.`);
    this.socketList.set(intraId, client);
  }

  // 게임관련 메세지
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
    const { roomName, mode } = payload;
    //check roomName is valid
    if (roomName == '' || roomName == undefined) {
      client.emit('game-exception', { roomName });
      return;
    }
    console.log(
      `${client['nickName']}(${client['intraId']}) 님이 게임을 시작했습니다.`,
    );
    client.join(roomName);
    // 두명이 다 입장했는지 확인 후, 게임시작
    const room = this.server.sockets.adapter.rooms.get(roomName);
    if (room && room.size == 2) {
      const roomSockets = [];
      room.forEach((socketId) => {
        const socket = this.server.sockets.sockets.get(socketId);
        roomSockets.push(socket);
      });
      this.gameService.enterGame(roomSockets, roomName, mode);
    }
  }

  @SubscribeMessage('game-apply')
  async handleGameApply(client: Socket, payload: Payload) {
    const { intraId, nickName, player2, mode } = payload;
    client['intraId'] = intraId;
    client['nickName'] = nickName;
    if (
      mode !== modeConstants.EASY &&
      mode !== modeConstants.NORMAL &&
      mode !== modeConstants.HARD
    ) {
      client.emit('game-exception', { mode });
      return;
    }
    try {
      const p2 = await this.memberService.getOneByNick(player2);
      const p2socket = this.socketList.get(p2.intraId);
      if (p2socket === undefined) {
        this.playerNotFoundEmitError(client, player2);
        return;
      }
      p2socket.emit('game-apply', { nickName, mode }); // 게임 수락/거절 화면을 뜨워야함. 프론트에서 처리
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
    if (
      mode !== modeConstants.EASY &&
      mode !== modeConstants.NORMAL &&
      mode !== modeConstants.HARD
    ) {
      client.emit('game-exception', { mode });
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
      p1socket.emit('game-reject', { nickName });
    } catch (error) {
      this.playerNotFoundEmitError(client, player1);
    }
  }

  playerNotFoundEmitError(client: Socket, nickName: string) {
    console.log(`${nickName}님이 존재하지 않습니다.`);
    client.emit('game-oppo-not-found', { nickName });
  }

  @SubscribeMessage('player-w')
  handlePlayerW(client: Socket, payload: Payload) {
    const { roomName } = payload;
    if (this.gameService.checkRoomName(roomName) == false) {
      client.emit('game-exception', { roomName });
      return;
    }
    this.gameService.playerW(client, roomName);
  }

  @SubscribeMessage('player-s')
  handlePlayerS(client: Socket, payload: Payload) {
    const { roomName } = payload;
    if (this.gameService.checkRoomName(roomName) == false) {
      client.emit('game-exception', { roomName });
      return;
    }
    this.gameService.playerS(client, roomName);
  }

  @SubscribeMessage('exit-game')
  handleGameExit(client: Socket, payload: Payload) {
    console.log('Socket - exitGame called');
    const { roomName } = payload;
    if (this.gameService.checkRoomName(roomName) == false) {
      client.emit('game-exception', { roomName });
      return;
    }
    this.gameService.playerExit(client, roomName);
  }

  // 채널관련 메세지
  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: Payload): Promise<string> {
    const { channelName, nickName, message, avatar } = payload;
    // mute check
    if (await this.channelService.ismuted(channelName, nickName)) {
      this.getSocketByintraId(client['intraId'])?.emit('mute');
      return 'Message received! But you are muted. You cannot send message.';
    }
    // ban check
    if (await this.channelService.isBan(channelName, client['intraId']))
      return 'Message received! But you are banned.';
    // dm 첫 메세지 알람
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

  @SubscribeMessage('first-enter')
  async handleFirstEnter(client: Socket, payload: Payload) {
    const { channelName } = payload;
    client.join(channelName);
    client.to(channelName).emit('welcome', client['nickName'], memberConstants.ADMIN + '.jpg');
  }

  @SubscribeMessage('enter-channel')
  async handleChannelEnter(client: Socket, payload: Payload) {
    const { channelName, nickName } = payload;
    client.join(channelName);
    console.log(`${nickName} enter channel : ${channelName}`);
  }

  @SubscribeMessage('leave-channel')
  async handleChannelLeave(client: any, payload: any) {
    const { channelName, chIdx, nickName } = payload;
    client.leave(channelName);
    if (await this.channelService.leave(chIdx, client['intraId'])) {
      const members = await this.memberService.getAll();
      client.to(channelName).emit('delete');
      members.map((users) => {
        if (users.intraId !== 'admin') {
          this.getSocketByintraId(users.intraId)?.emit('leave-channel');
          this.getSocketByintraId(users.intraId)?.emit('reload');
        }
      });
    }
    console.log(`${nickName} leave channel : ${channelName}`);
  }

  // 일반채널 생성
  @UseFilters(ConflictExceptionFilter)
  @SubscribeMessage('create-channel')
  async handleChannelCreate(client: Socket, payload: Payload) {
    const { channelName, password } = payload;
    try {
      const channel = await this.channelService.create(
        {
          intraId: client['intraId'],
          nickName: client['nickName'],
          avatar: client['avatar'],
        },
        { chName: channelName, chPwd: password },
      );
      client.emit('new-channel', { chIdx: channel.chIdx });
    } catch (error) {
      if (error.response.statusCode === 409) client.emit('duplicate-chanName');
      else if (error.response.statusCode === 403) client.emit('max-channel');
      else if (error.response.statusCode === 500) client.emit('server-error');
    }
    const members = await this.memberService.getAll();
    members.map((users) => {
      if (users.intraId !== 'admin')
        this.getSocketByintraId(users.intraId)?.emit('reload');
    });
  }

  // invite
  @UseFilters(ConflictExceptionFilter)
  @SubscribeMessage('channel-invite')
  async handleChannelInvite(client: Socket, payload: Payload) {
    const { channelName, nickName } = payload;
    try {
      const user = await this.memberService.getOneByNick(nickName);
      const userSocket = this.getSocketByintraId(user.intraId);
      this.channelService.channelInvite(channelName, {
        intraId: user.intraId,
        avatar: user.avatar,
        nickName: user.nickName,
      });
      // nickName 님이 channelName 에 초대하셨습니다 이런거
      userSocket?.emit('invite', client['nickName'], channelName);
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
