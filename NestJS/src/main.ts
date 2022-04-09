import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const { PORT, MODE } = process.env;
if (!PORT || !MODE) {
  throw new Error('NO_ENV');
}

const isDev: boolean = MODE === 'dev' ? true : false;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('NestJS_Cats_API')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
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
