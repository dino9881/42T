import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // CORS 허용
      cors: {
        origin: 'http://localhost:3000',
        credentials: true,
      },
    });
  await app.listen(5001);
}
bootstrap();
