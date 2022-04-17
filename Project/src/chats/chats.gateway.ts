import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'chats' }) // namespace : 라우팅과 비슷하다고 보면 됨!
export class ChatsGateway {
  @SubscribeMessage('new_user') //* socket.on('new_user', username) => 클라에서 emit으로 보내면 서버에서 on으로 받는다.
  handleNewUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log(username);
    console.log(socket.id); //* 아이디는 연결이 끊기기 전까지 유지가 된다!

    socket.emit('hello_user', `Hello ${username}`);
    return 'Hello World!';
  }
}
