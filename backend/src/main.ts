import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ValidationPipe } from '@nestjs/common';
import { swaggerConfig } from './swagger';
import { json, urlencoded } from 'body-parser';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { PrismaService } from './prisma/prisma.service';
import { ConfigType } from '@nestjs/config';
import appConfig from './config/app.config';

const logger = new Logger('App');
async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const config: ConfigType<typeof appConfig> = app.get(appConfig.KEY);
    app.use(cookieParser(config.cookeSecret));
    app.useGlobalPipes(new ValidationPipe());
    app.useWebSocketAdapter(new IoAdapter(app));
    const corsOptions: CorsOptions = {
      origin: config.frontUrl,
      credentials: true,
    };
    app.enableCors(corsOptions);
    swaggerConfig(app);

    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ limit: '50mb', extended: true }));
    await app.listen(config.backPort);
    const prismaService = app.get(PrismaService);
    await prismaService.enableShutdownHooks(app);
  } catch (error) {
    logger.error('An error occurred', error.stack);
  }
}
bootstrap();
