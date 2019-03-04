import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as httpContext from 'express-http-context';
import * as bearerToken from 'express-bearer-token';
import * as dotenv from 'dotenv';
import { loggerMiddleware } from './common/middlewares/logger.middleware';
import { HttpExceptionFilter } from './common/exceptions/http-exception-filter';
import { ValidationPipe } from './common/pipe/validation.pipe';

dotenv.config();

async function bootstrap() {
  const server = express();
  server.use(bodyParser.json());

  server.use(httpContext.middleware);
  server.use((req, res, next) => {
    const reqId = Math.floor(Math.random() * 2821109907456).toString(36);
    httpContext.set('reqId', reqId);
    httpContext.set('ip', req.ip);
    next();
  });
  server.use(loggerMiddleware);
  server.use(bearerToken());

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
