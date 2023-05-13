import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
import { Logger } from '@nestjs/common';

const logger = new Logger('App');
async function bootstrap() {
  try{
    const app = await NestFactory.create(AppModule, {
      cors:{
        origin: 'http://localhost:3000',
        credentials:true,
      },
    });
    await app.listen(5001);

    const prismaService = app.get(PrismaService);
    await prismaService.enableShutdownHooks(app)

  }
  catch (error) {
    logger.error('An error occurred', error.stack);
  }
}
bootstrap();
