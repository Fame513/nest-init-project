import { NestMiddleware, MiddlewareFunction, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../configs';
import { AuthorizationError } from '../../constants';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	constructor() {
	}

	resolve(): MiddlewareFunction {
		return async (req, res, next) => {
			let data: any = {};
			const token = req.token;
			if (!token) {
				throw AuthorizationError;
			}
			try {
				data = jwt.verify(token, JWT_SECRET);
			} catch (e) {
				throw AuthorizationError;
			}
			if (!data.appName || !data.deviceType) {
				throw AuthorizationError;
			}
			req.deviceInfo = {
				appName: data.appName,
				deviceType: data.deviceType
			};
			next!();
		};
	}
}
