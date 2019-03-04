import { HttpException } from '@nestjs/common';

export class HttpCodeException extends HttpException {
  constructor(private readonly httpstatus: number,
              private readonly errorCode: number,
              private readonly errorMessage: string) {
    super('', httpstatus);
  }

  getResponse(): string | object {
    return {
      errorCode: this.errorCode,
      errorMessage: this.errorMessage
    };
  }

  getStatus(): number {
    return this.httpstatus;
  }

  getErrorCode(): number {
    return this.errorCode;
  }

  sendResponse(res) {
    res.status(this.getStatus()).send(this.getResponse());
  }
}
