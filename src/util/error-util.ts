import { HttpCodeException } from '../common/exceptions/http-code.exception';
import { CODE_VALIDATION_FAILED } from '../constants';
import { HttpStatus } from '@nestjs/common';

export class ErrorUtil {
  static getValidationError(message: string): HttpCodeException {
    return new HttpCodeException(HttpStatus.BAD_REQUEST, CODE_VALIDATION_FAILED, 'Validation failed: ' + message);
  }

  static getCustomError(message: string): HttpCodeException {
    return new HttpCodeException(HttpStatus.INTERNAL_SERVER_ERROR, 999, 'Server error: ' + message);
  }
}

export class NodeAsyncError extends Error {
    constructor(public readonly height, public readonly expected) {
      super('Async node error, height: ' + height + ', expected ' + expected);
    }
}
