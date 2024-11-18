import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:9090', 'http://localhost:8000'],
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    credentials: true, // Permitir cookies ou autenticação se necessário
  });
  const options = new DocumentBuilder()
    .setTitle('Insights provider for receivables')
    .setDescription('SPGrafeno insights provider')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
