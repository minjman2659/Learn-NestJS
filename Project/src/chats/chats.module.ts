import { ChatsGateway } from './chats.gateway';
import { Module } from '@nestjs/common';

@Module({
  providers: [ChatsGateway],
})
export class ChatsModule {}
