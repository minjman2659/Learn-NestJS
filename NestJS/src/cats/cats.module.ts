import { MongooseModule } from '@nestjs/mongoose';
import { forwardRef, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { CatsController, CatsService } from './';
import { CatsRepository } from './repository';
import { AuthModule } from 'src/auth';
import { Cat, CatSchema } from 'src/schema';

@Module({
  imports: [
    MulterModule.register({
      dest: './public',
    }),
    MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }]),
    forwardRef(() => AuthModule),
  ],
  controllers: [CatsController],
  providers: [CatsService, CatsRepository],
  exports: [CatsService, CatsRepository],
})
export class CatsModule {}
