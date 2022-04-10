import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import * as expressBasicAuth from 'express-basic-auth';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

const { PORT, MODE } = process.env;
if (!PORT || !MODE) {
  throw new Error('NO_ENV');
}

const isDev: boolean = MODE === 'dev' ? true : false;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(
    ['/docs'],
    expressBasicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
      },
    }),
  );

  app.useStaticAssets(path.resolve(process.cwd(), './public'), {
    prefix: '/media',
  });

  const config = new DocumentBuilder()
    .setTitle('NestJS_Cats_API')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors({
    origin: isDev ? true : 'http://localhost:3000',
    credentials: true,
  });

  await app.listen(PORT);
  console.log(`Server is running in ${PORT} port`);
  console.log(`API Docs in http://localhost:${PORT}/docs`);
}
bootstrap();
