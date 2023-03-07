import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import bcrypt from 'bcryptjs';
import { HTTPError } from '../errors/custom.error.js';

const salt = 10;

export interface PayloadToken extends jwt.JwtPayload {
  id: string;
  role: string;
}

export class Auth {
  static createJWT(payLoad: PayloadToken) {
    if (!config.jwtSecret) return;
    return jwt.sign(payLoad, config.jwtSecret as string);
  }

  static getTokenPayload(token: string) {
    const result = jwt.verify(token, config.jwtSecret as string);
    if (typeof result === 'string')
      throw new HTTPError(498, 'Invalid payload', result);
    return result as PayloadToken;
  }

  static hash(value: string) {
    return bcrypt.hash(value, salt);
  }

  static compare(value: string, hash: string) {
    return bcrypt.compare(value, hash);
  }
}
