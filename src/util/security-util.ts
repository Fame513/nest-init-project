'use strict';

export class SecurityUtil {

  private static readonly SECURE_KEYS: string[] = [
    'api_key',
    'authorization',
    'password',
    'secret',
    'token',
    'x-api-key'
  ];

  static securifyParams(params: object): any {
    if (typeof params !== 'object') {
      return params;
    }

    const result = JSON.parse(JSON.stringify(params));

    for (const key in result) {
      if (!result.hasOwnProperty(key)) {
        continue;
      }

      if (typeof result[key] === 'object') {
        result[key] = this.securifyParams(result[key]);
        continue;
      }

      if (typeof result[key] === 'string' && this.isSensitiveParam(key)) {
        result[key] = this.replaceDataWithStars(result[key]);
      }
    }

    return result;
  }

  static replaceDataWithStars(str: string): string {
    if (typeof str === 'string') {
      return str.replace(/[a-zA-Z\d-]/g, '*');
    }

    return str;
  }

  static secureCardNumber(cardNumber: string): string {
    const regex = /^(\d{2})\d(?=\d)|\d(?=\d{4})/g;
    return cardNumber.replace(regex, '$1*');
  }

  private static isSensitiveParam(paramName: string): boolean {
    let isSensitive = false;

    for (const secureKey of this.SECURE_KEYS) {
      if (paramName.toLowerCase().indexOf(secureKey) !== -1) {
        isSensitive = true;
        break;
      }
    }

    return isSensitive;
  }
}