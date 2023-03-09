import { Response, Request, NextFunction } from 'express';
import { Repo } from '../repository/repo.interface.js';
import { HTTPError } from '../errors/custom.error.js';
import createDebug from 'debug';
import { Euphonium } from '../entities/euphonium.js';
import { User } from '../entities/user.js';
import { RequestPlus } from '../interceptors/logged.js';
const debug = createDebug('W6:controller:euphoniums');

export class EuphoniumsController {
  constructor(
    public usersRepo: Repo<User>,
    public euphoniumsRepo: Repo<Euphonium>
  ) {
    debug('Instantiate');
  }

  async get(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('get');
      const data = await this.euphoniumsRepo.queryId(req.params.id);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(_req: Request, resp: Response, next: NextFunction) {
    try {
      debug('getAll');
      const data = await this.euphoniumsRepo.query();
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async post(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      debug('post');
      const userId = req.info?.id;
      if (!userId) throw new HTTPError(404, 'Not found', 'Not found user id');
      const actualUser = await this.usersRepo.queryId(userId);
      req.body.creator = userId;
      const newEuphonium = await this.euphoniumsRepo.create(req.body);
      actualUser.euphoniums.push(newEuphonium);
      this.usersRepo.update(actualUser);
      resp.json({
        results: [newEuphonium],
      });
    } catch (error) {
      next(error);
    }
  }

  async patch(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('patch');
      req.body.id = req.params.id ? req.params.id : req.body.id;
      const data = await this.euphoniumsRepo.update(req.body);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('delete');
      await this.euphoniumsRepo.remove(req.params.id);
      resp.json({
        results: [],
      });
    } catch (error) {
      next(error);
    }
  }
}
