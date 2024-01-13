import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import * as fs from 'fs';

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === 'production';
  const sslDir = process.env.SSL_DIR;
  let httpsOptions: any = undefined;
  let port = process.env.APP_PORT || 3003;

  if (isProduction) {
    httpsOptions = {
      key: fs.readFileSync(`${sslDir}/privkey.pem`),
      cert: fs.readFileSync(`${sslDir}/cert.pem`),
    };

    port = 443;
  }

  const app = await NestFactory.create(AppModule, { httpsOptions });

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  //const reflector = app.get(Reflector);
  //app.useGlobalGuards(new JwtAuthGuard(reflector));

  const config = new DocumentBuilder()
    .setTitle('api.meumercado')
    .setDescription('Meumercado API Documentation')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
}
bootstrap();
