import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Teste Técnico API')
    .setDescription('Documentação da API')
    .setVersion('0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.getHttpAdapter().get('/openapi.json', (_req, res) => {
    res.json(document);
  });

  app.use(
    '/docs',
    apiReference({
      layout: 'modern',
      theme: 'purple',
      url: '/openapi.json',
      darkMode: true,
      hideModels: true,
      hideDownloadButton: true,
    }),
  );

  app.use(cookieParser());
  app.use(helmet());

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization, api-key',
    credentials: true,
  });

  const port = process.env.PORT ?? 3003;
  await app.listen(port);

  console.log(`-> Aplicação executando na porta ${port}`);
  console.log(`-> Documentação disponível em http://localhost:3003/docs`);
}
void bootstrap();
