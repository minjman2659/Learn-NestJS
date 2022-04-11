import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from 'src/auth/auth.module';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { CatsRepository } from './repository/cats.repository';
import { Cat, CatSchema } from 'src/schema/cats.schema';
import { Comment, CommentSchema } from 'src/schema/comments.schema';

@Module({
  imports: [
    MulterModule.register({
      dest: './public',
    }),
    MongooseModule.forFeature([
      { name: Cat.name, schema: CatSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [CatsController],
  providers: [CatsService, CatsRepository],
  exports: [CatsService, CatsRepository],
})
export class CatsModule {}
