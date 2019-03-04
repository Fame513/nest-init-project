import { Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { HttpCodeException } from './http-code.exception';
import {logger} from '../../util/logger';

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(err, host) {
    const res = host.switchToHttp().getResponse();
    if (err instanceof HttpCodeException) {
      logger.warn('Exception', err);
      return res.status(err.getStatus()).send(err.getResponse());
    } else {
      logger.error('Error', err);
      if (err.status === 404) {
        return res.status(err.status).send(err.response);  
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        error: err,
        message: err && (err.message || err.errorMessage || err.toString())
      });
    }
  }
}