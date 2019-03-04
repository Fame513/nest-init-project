/* Warning, don't spend the time on creating tests for this file. Jest using this file for writing logs. */

'use strict';

import * as winston from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';
import { format, LeveledLogMethod, LogMethod } from 'winston';
import { QueryRunner } from 'typeorm';
const httpContext = require('express-http-context');
import * as typeorm from 'typeorm';
import { LOGGER_KEY_FILENAME, LOGGER_PROJECT_ID } from '../configs';

export interface Logger {
  log: LogMethod;
  error: LeveledLogMethod;
  warn: LeveledLogMethod;
  verbose: LeveledLogMethod;
  info: LeveledLogMethod;
  debug: LeveledLogMethod;
  silly: LeveledLogMethod;
  remove: (transport: any) => any;
  transports: any;
}

class LoggerFactory {
  private static logger: Logger;

  static getLogger(): Logger {
    if (LoggerFactory.logger) {
      return LoggerFactory.logger;
    }

    const winstonLogger = winston.createLogger({
      transports: [
        new (winston.transports.Console)({
          format: format.colorize()
        }),
        new LoggingWinston({
          projectId: LOGGER_PROJECT_ID,
          keyFilename: LOGGER_KEY_FILENAME
        })
      ]
    });
    this.logger = {
      log: function(level, message, ...meta: any[]) {
        meta = LoggerFactory.updateMetaWithId(meta);
        winstonLogger.log(level, message, ...meta);
        return winstonLogger;
      } as LogMethod,
      error: (message, ...meta: any[]) => {
        meta = LoggerFactory.updateMetaWithId(meta);
        winstonLogger.error(message, ...meta);
        return winstonLogger;
      },
      warn: (message, ...meta: any[]) => {
        meta = LoggerFactory.updateMetaWithId(meta);
        winstonLogger.warn(message, ...meta);
        return winstonLogger;

      },
      verbose: (message, ...meta: any[]) => {
        meta = LoggerFactory.updateMetaWithId(meta);
        winstonLogger.verbose(message, ...meta);
        return winstonLogger;

      },
      info: (message, ...meta: any[]) => {
        meta = LoggerFactory.updateMetaWithId(meta);
        winstonLogger.info(message, ...meta);
        return winstonLogger;

      },
      debug: (message, ...meta: any[]) => {
        meta = LoggerFactory.updateMetaWithId(meta);
        winstonLogger.debug(message, ...meta);
        return winstonLogger;
      },
      silly: (message, ...meta: any[]) => {
        meta = LoggerFactory.updateMetaWithId(meta);

        winstonLogger.silly(message, ...meta);
        return winstonLogger;
      },
      remove: (transport) => {
        winstonLogger.remove(transport);
      },
      transports: winstonLogger.transports
    };
    return this.logger;
  }

  private static updateMetaWithId(meta: any[]) {
    let callback;
    if (meta && typeof(meta[meta.length - 1]) === 'function') {
      callback = meta.pop();
    }

    let newMeta =  meta.pop();

    const reqId = httpContext.get('reqId');
    const ip = httpContext.get('ip');
    if (newMeta == undefined) {
      newMeta = {labels: {requestId: reqId}};
    } else if (typeof(newMeta) === 'object') {
      newMeta = Object.assign({}, newMeta, {labels: {requestId: reqId, ip}});
    } else if (typeof(newMeta) === 'string' || typeof(newMeta) === 'number' || typeof(newMeta) === 'boolean') {
      meta.push(newMeta);
      newMeta = {labels: {requestId: reqId, ip}};
    }
    if (newMeta) {
      meta.push(newMeta);
    }
    if (callback) {
      meta.push(callback);
    }

    return meta;
  }
}

export const logger = LoggerFactory.getLogger();

export class WinstonLogger implements typeorm.Logger {

  previousQuery: string | undefined;
  queryCounter: number = 0;

  logQuery(query: string, parameters?: any[] | undefined, queryRunner?: QueryRunner | undefined) {
    if (this.previousQuery === query) {
      this.queryCounter++;
    } else {
      if (this.queryCounter !== 0) {
        logger.info('  +' + this.queryCounter + ' same queries');
      }
      this.previousQuery = query;
      this.queryCounter = 0;
      logger.info('Query: ' + query, parameters);
    }
  }

  logQueryError(error: string, query: string, parameters?: any[] | undefined, queryRunner?: QueryRunner | undefined) {
    logger.error('Query error: ' + error + ', query: ' + query, parameters);
  }

  logQuerySlow(time: number, query: string, parameters?: any[] | undefined, queryRunner?: QueryRunner | undefined) {
    logger.info('Slow: ' + query, parameters);
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner | undefined) {
    logger.info(message);
  }

  logMigration(message: string, queryRunner?: QueryRunner | undefined) {
    logger.info(message);
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner | undefined) {
    if (level === 'log' || level === 'info') {
      logger.info(message);
    } else if (level === 'warn') {
      logger.warn(message);
    }
  }
}
