import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const logger = new Logger('App');
async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      cors: {
        origin: 'http://localhost:3000',
        credentials: true,
      },
    });
    const config = new DocumentBuilder()
      .setTitle('42T')
      .setDescription('The 42seoul Transcendence API description')
      .setVersion('1.0')
      .addTag('Member')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(5001);

    const prismaService = app.get(PrismaService);
    await prismaService.enableShutdownHooks(app);
  } catch (error) {
    logger.error('An error occurred', error.stack);
  }
}
bootstrap();
