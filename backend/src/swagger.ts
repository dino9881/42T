import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = (app: INestApplication) => {
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
};
