import { Module } from '@nestjs/common';
import { ORM_CONFIG_AWS_PROD } from './configs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonLogger } from './util/logger';

ORM_CONFIG_AWS_PROD.logger = new WinstonLogger();

@Module({
  imports: [TypeOrmModule.forRoot(ORM_CONFIG_AWS_PROD)],
  controllers: [],
  providers: [],
})
export class AppModule {}
