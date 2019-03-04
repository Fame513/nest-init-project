import * as dotenv from 'dotenv';
dotenv.config();

import { ValidationPipe } from '../src/common/pipe/validation.pipe';
import { ORM_CONFIG_MEMORY } from '../src/configs';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection, getConnection, Repository } from 'typeorm';
import { HttpStatus, RequestMethod } from '@nestjs/common';
import { AuthorizationError } from '../src/constants';
import * as request from 'supertest';
import * as bearerToken from 'express-bearer-token';

export async function initTestApp(server) {
  const ORM_CONFIG = ORM_CONFIG_MEMORY;
  server.use(bearerToken());

  const module = await Test.createTestingModule({
    imports: [TypeOrmModule.forRoot(ORM_CONFIG)],
  }).compile();
  const app = module.createNestApplication(server);
  app.useGlobalPipes(new ValidationPipe());

  await app.init();

  const connection = await getConnection(ORM_CONFIG.name);

  (connection as any).TEST_APP = app;

  return connection;
}

export async function createTestData() {
  const db: Connection = await getConnection(ORM_CONFIG_MEMORY.name);

}

export async function clearDatabase() {
  const db: Connection = await getConnection();
  await db.dropDatabase();
}

export function testErrors(bodies: any, httpCode: number, errorCode: string, server, requestMethod: RequestMethod, url: string, authHeader: () => string, headerName: string = 'Authorization') {
  for (const key in bodies) {
    it(`${RequestMethod[requestMethod]} ${url} - fail - ${key}`, async () => {
      return startRequest(server, requestMethod, url)
        .set(headerName, authHeader())
        .send(bodies[key])
        .expect(httpCode)
        .then(async response => {
          expect(response.body.error).toEqual(errorCode);
          expect(response.body.error_description).toEqual(expect.any(String));
        });
    });
  }
}

export function testAnonymousAuth(server, requestMethod: RequestMethod, url: string) {
  it('no header', async () => {
    return startRequest(server, requestMethod, url)
      .expect(HttpStatus.UNAUTHORIZED)
      .then(async response => {
        expect(response.body).toEqual(AuthorizationError.getResponse());
      });
  });
  it('jwt with different secret key', async () => {
    return startRequest(server, requestMethod, url)
      .set('Authorization', 'Bearer ' + 'erwerwerwer')
      .expect(HttpStatus.UNAUTHORIZED)
      .then(async response => {
        expect(response.body).toEqual(AuthorizationError.getResponse());
      });
  });
}

export function startRequest(server, requestMethod: RequestMethod, method: string, body?: any) {
  let result;
  switch (requestMethod) {
    case RequestMethod.POST:
      result = request(server).post(method);
      if (body) {
        result = result.send(body);
      }
      break;
    case RequestMethod.PUT:
      result = request(server).put(method);
      if (body) {
        result = result.send(body);
      }
      break;
    case RequestMethod.GET:
      result = request(server).get(method);
      break;
    case RequestMethod.DELETE:
      result = request(server).delete(method);
      break;
  }
  expect(result).toBeDefined();
  return result;
}
