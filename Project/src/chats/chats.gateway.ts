import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'chats' }) //* namespace : 라우팅과 비슷하다고 보면 됨!
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('chat');

  constructor() {
    this.logger.log('constructor'); //* 서버 실행시 가장 먼저 실행
  }

  afterInit() {
    this.logger.log('init'); //* 서버 실행시 두번째로 실행
  }

  //* 클라와 web-socket 연결이 되면 실행
  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`connected : ${socket.id}, ${socket.nsp.name}`);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`disconnected`);
  }

  @SubscribeMessage('new_user') //* socket.on('new_user', username) => 클라에서 emit으로 보내면 서버에서 on으로 받는다.
  handleNewUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ) {
    //* broadcast : 연결된 모든 socket에 보내는 socket 메소드
    socket.broadcast.emit('user_connected', username);
    return username;
  }

  @SubscribeMessage('submit_chat')
  handleSubmitChat(
    @MessageBody() message: string,
    @ConnectedSocket() socket: Socket,
  ) {
    //* broadcast : 연결된 모든 socket에 보내는 socket 메소드
    socket.broadcast.emit('new_chat', { message, user: socket.id });
    return message;
  }
}
