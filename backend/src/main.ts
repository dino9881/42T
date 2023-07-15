import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ValidationPipe } from '@nestjs/common';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { swaggerConfig } from './swagger';
import { SocketIOGateway } from './socketIO/socketio.gateway';

const logger = new Logger('App');
async function bootstrap() {
  const serverOptions = {
    cors: {
      origin: true,
      credentials: true,
    },
  };
  try {
    const app = await NestFactory.create(AppModule, serverOptions);
    app.use(cookieParser('cookieSecret'));
    app.useGlobalPipes(new ValidationPipe());
    app.useWebSocketAdapter(new IoAdapter(app));
    swaggerConfig(app);

    // const server = app.getHttpServer();
    // const io = new Server(server);

    // io.on('connection', (socket) => {
    //   console.log('Some Socket connected');
    //   console.log(socket.id);
    // });
    await app.listen(5001);
  } catch (error) {
    logger.error('An error occurred', error.stack);
  }
}
bootstrap();
