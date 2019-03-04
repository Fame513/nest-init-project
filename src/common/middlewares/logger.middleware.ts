import { logger } from '../../util/logger';
import { SecurityUtil } from '../../util/security-util';
import { IS_PROD } from '../../configs';

export const loggerMiddleware = (req, res, next) => {
  logger.info(req.url, {
    httpRequest: {
      status: res.statusCode,
      requestUrl: req.url,
      responseSize: res.body ? JSON.stringify(res.body).length : 0,
      requestMethod: req.method,
      userAgent: req.get('User-Agent'),
      latency: {seconds: 0}
    },
    body: IS_PROD ? SecurityUtil.securifyParams(req.body) : req.body,
    query: IS_PROD ? SecurityUtil.securifyParams(req.query) : req.query,
    headers: IS_PROD ? SecurityUtil.securifyParams(req.headers) : req.headers,
  });

  const oldWrite = res.write,
    oldEnd = res.end;

  const chunks: any[] = [];

  res.write = function(chunk) {
    chunks.push(chunk);

    oldWrite.apply(res, arguments);
  };

  res.end = function(chunk) {
    try {
      if (chunk) {
        chunks.push(chunk);
      }

      const normalizedChunks = chunks.map(c => typeof c === 'string' ? new Buffer(c) : c);
      let body = Buffer.concat(normalizedChunks).toString('utf8');

      try {
        const obj = JSON.parse(body);
        body = SecurityUtil.securifyParams(obj);
      } catch (e) {
      }
      const stringifiedBody = JSON.stringify(body);
      logger.info('RESPONSE ' + req.url, stringifiedBody.length > 4096 ? stringifiedBody.slice(0, 4096) : body);
    } catch (e) {
    }

    oldEnd.apply(res, arguments);
  };
  next();
};
