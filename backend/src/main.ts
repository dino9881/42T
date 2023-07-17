import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ValidationPipe } from '@nestjs/common';
// import { createServer } from 'http';
// import { Server } from 'socket.io';
import { swaggerConfig } from './swagger';
import { json, urlencoded } from 'body-parser';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { PrismaService } from './prisma/prisma.service';

const logger = new Logger('App');
async function bootstrap() {
  const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
  };
  try {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser('cookieSecret'));
    app.useGlobalPipes(new ValidationPipe());
    app.useWebSocketAdapter(new IoAdapter(app));
    app.enableCors(corsOptions);
    swaggerConfig(app);

    // const server = app.getHttpServer();
    // const io = new Server(server);
    // io.on('connection', (socket) => {
    //   console.log('Some Socket connected');
    //   console.log(socket.id);
    // });

    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ limit: '50mb', extended: true }));
    await app.listen(5001);
    const prismaService = app.get(PrismaService);
    await prismaService.enableShutdownHooks(app);
  } catch (error) {
    logger.error('An error occurred', error.stack);
  }
}
bootstrap();
