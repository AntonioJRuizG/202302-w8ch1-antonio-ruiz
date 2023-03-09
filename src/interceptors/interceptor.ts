import createDebug from 'debug';
import { User } from '../entities/user';
import { Repo } from '../repository/repo.interface';
import { RequestPlus } from './logged';
import { Response, NextFunction } from 'express';
import { HTTPError } from '../errors/custom.error';
import { Euphonium } from '../entities/euphonium';
import { Auth } from '../helpers/auth';

const debug = createDebug('w6:interceptor');

export class Interceptor {
  constructor(
    public euphoniumsRepo: Repo<Euphonium>,
    public repoUsers: Repo<User>
  ) {
    debug('Instantiate');
  }

  async authorized(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      debug('Called');
      if (!req.info)
        throw new HTTPError(
          498,
          'Token not found',
          'Token not found in Authorized interceptor'
        );
      const userId = req.info.id;
      const euphoniumId = req.params.id;

      const euphonium = await this.euphoniumsRepo.queryId(euphoniumId);
      debug('Euphonium', euphonium.creator);
      debug('User', userId);
      if (euphonium.creator.id !== userId)
        throw new HTTPError(401, 'Not authorized', 'Not authorized');
      next();
    } catch (error) {
      next(error);
    }
  }

  logged(req: RequestPlus, resp: Response, next: NextFunction) {
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
}
