import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  SwaggerModule.setup(
    'api',
    app,
    SwaggerModule.createDocument(app, {
      info: {
        title: 'Insights provider for receivables',
        description: 'SPGrafeno insights provider',
        version: '1.0',
      },
      openapi: '3.0.0',
    }),
  );

  await app.listen(3000);
}
bootstrap();
