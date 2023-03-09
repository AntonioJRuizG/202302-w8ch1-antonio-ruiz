import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import { HTTPError } from '../errors/custom.error';
import { Auth, PayloadToken } from '../helpers/auth';
const debug = createDebug('W6:interceptor:logged');

export interface RequestPlus extends Request {
  info?: PayloadToken;
}

export function logged(req: RequestPlus, resp: Response, next: NextFunction) {
  try {
    debug('Called');
    const authHeader = req.get('Authorization');
    if (!authHeader)
      throw new HTTPError(498, 'Token invalid', 'Not value in auth header');
    if (!authHeader.startsWith('Bearer'))
      throw new HTTPError(498, 'Token invalid', 'Not Bearer in auth header');
    const token = authHeader.slice(7);
    const payload = Auth.getTokenPayload(token);
    req.info = payload;
    next();
  } catch (error) {
    next(error);
  }
}
