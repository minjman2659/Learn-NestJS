import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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
import { Chat } from './models/chats.model';
import { Socket as SocketModel } from './models/sockets.model';
import { Model } from 'mongoose';

@WebSocketGateway({ namespace: 'chats' }) //* namespace : 라우팅과 비슷하다고 보면 됨!
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('chat');

  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
    @InjectModel(Socket.name) private readonly socketModel: Model<SocketModel>,
  ) {
    this.logger.log('constructor'); //* 서버 실행시 가장 먼저 실행
  }

  afterInit() {
    this.logger.log('init'); //* 서버 실행시 두번째로 실행
  }

  //* 클라와 web-socket 연결이 되면 실행
  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`connected : ${socket.id}, ${socket.nsp.name}`);
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    const user = await this.socketModel.findOne({ id: socket.id });
    const chats = await this.chatModel.find({ user });
    if (user) {
      await user.delete();
      await Promise.all(chats)
        .then((chats) => chats.forEach((chat) => chat.delete()))
        .catch((err) => {
          throw new Error(err);
        });
      socket.broadcast.emit('disconnected_user', user.username);
    }
    this.logger.log(`disconnected`);
  }

  @SubscribeMessage('new_user') //* socket.on('new_user', username) => 클라에서 emit으로 보내면 서버에서 on으로 받는다.
  async handleNewUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const isExisted = await this.socketModel.exists({ username });
    if (isExisted) {
      username = `${username}_${Date.now()}`;
    }
    await this.socketModel.create({
      id: socket.id,
      username,
    });
    //* broadcast : 연결된 모든 socket에 보내는 socket 메소드
    socket.broadcast.emit('user_connected', username);
    return username;
  }

  @SubscribeMessage('submit_chat')
  async handleSubmitChat(
    @MessageBody() chat: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const socketObj = await this.socketModel.findOne({ id: socket.id });
    await this.chatModel.create({
      user: socketObj,
      chat,
    });
    //* broadcast : 연결된 모든 socket에 보내는 socket 메소드
    socket.broadcast.emit('new_chat', { chat, username: socketObj.username });
  }
}
