import { Response, Request, NextFunction } from 'express';
import { User } from '../entities/user.js';
import { Repo } from '../repository/repo.interface.js';
import { Auth, PayloadToken } from '../helpers/auth.js';
import { HTTPError } from '../errors/custom.error.js';
import createDebug from 'debug';
const debug = createDebug('W6:controller:users');

export class UsersController {
  constructor(public repo: Repo<User>) {
    debug('Instantiate');
  }

  async getAll(_req: Request, resp: Response, next: NextFunction) {
    try {
      debug('getAll');
      const data = await this.repo.query();
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('register:post');
      if (!req.body.email || !req.body.password)
        throw new HTTPError(401, 'Unauthorized', 'Invalid Email or password');
      req.body.password = await Auth.hash(req.body.password);

      req.body.friends = [];
      req.body.enemies = [];

      const data = await this.repo.create(req.body);
      resp.status(201);
      resp.json({
        results: [data],
      });
    } catch (error) {
      debug('Regiter failed');
      next(error);
    }
  }

  async login(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('login:post');
      if (!req.body.email || !req.body.password)
        throw new HTTPError(401, 'Unauthorized', 'Invalid Email or password');
      const data = await this.repo.search({
        key: 'email',
        value: req.body.email,
      });
      if (!data.length)
        throw new HTTPError(401, 'Unauthorized', 'Email not found');
      if (!(await Auth.compare(req.body.password, data[0].password)))
        throw new HTTPError(401, 'Unauthorized', 'Password not match');
      const payload: PayloadToken = {
        id: data[0].id,
        role: 'admin',
      };
      const token = Auth.createJWT(payload);
      resp.status(202);
      resp.json({
        token,
      });
    } catch (error) {
      next(error);
    }
  }
}
