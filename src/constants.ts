import { HttpStatus } from '@nestjs/common';
import { HttpCodeException } from './common/exceptions/http-code.exception';

export const CODE_INTERNAL_SERVER_ERROR = 999;
export const CODE_VALIDATION_FAILED = 1000;
export const CODE_ITEM_NOT_FOUND = 1001;
export const CODE_UNAUTHORIZED = 1002;

export const InternalServerError = new HttpCodeException(HttpStatus.INTERNAL_SERVER_ERROR, CODE_INTERNAL_SERVER_ERROR, 'There is some errors with external services');
export const ValidationError = new HttpCodeException(HttpStatus.BAD_REQUEST, CODE_VALIDATION_FAILED, 'Validation failed');
export const ItemNotFoundError = new HttpCodeException(HttpStatus.NOT_FOUND, CODE_ITEM_NOT_FOUND, 'Item not found');
export const AuthorizationError = new HttpCodeException(HttpStatus.UNAUTHORIZED, CODE_UNAUTHORIZED, 'Authorization error');

export const InvalidBlockchainError = new HttpCodeException(HttpStatus.INTERNAL_SERVER_ERROR, CODE_INTERNAL_SERVER_ERROR, 'Blockchain node does not respond');
export const EosDeadlineException = new HttpCodeException(HttpStatus.INTERNAL_SERVER_ERROR, CODE_INTERNAL_SERVER_ERROR, 'Deadline exception in eos node');
