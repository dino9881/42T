import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ValidationPipe } from '@nestjs/common';

const logger = new Logger('App');
async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      cors: {
        origin: true,
        credentials: true,
      },
    });
    app.use(cookieParser('cookieSecret'));
    app.useWebSocketAdapter(new IoAdapter(app));

    const config = new DocumentBuilder()
      .setTitle('42T')
      .setDescription('The 42seoul Transcendence API description')
      .setVersion('1.0')
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'access_token',
        in: 'header',
        description: 'JWT Access Token',
      })
      .addCookieAuth('refresh_token')
      .setDescription(
        'The 42seoul Transcendence API description<br/><br/><a href="https://insomnia.rest/run/?label=My%20API&uri=http%3A%2F%2Flocalhost%3A5001%2Fapi-json" target="_blank"><img src="https://insomnia.rest/images/run.svg" alt="Run in Insomnia"></a>',
      )
      .setExternalDoc('Postman Collection', '/api-json')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
      swaggerOptions: {
        defaultModelsExpandDepth: -1,
        persistAuthorization: true,
      },
    });

    await app.listen(5001);
    app.useGlobalPipes(new ValidationPipe());

    const prismaService = app.get(PrismaService);
    await prismaService.enableShutdownHooks(app);
  } catch (error) {
    logger.error('An error occurred', error.stack);
  }
}
bootstrap();
