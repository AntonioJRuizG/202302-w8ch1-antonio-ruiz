import { Router } from 'express';
import { EuphoniumsController } from '../controllers/euphoniums.controller';
import { authorized } from '../interceptors/authorized';
import { logged } from '../interceptors/logged';
import { EuphoniumsMongoRepo } from '../repository/euphonium/euphonium.mongo.repo';
import { UsersMongoRepo } from '../repository/user/users.mongo.repo';

// eslint-disable-next-line new-cap
export const euphoniumsRouter = Router();
const euphoniumsRepo = EuphoniumsMongoRepo.getInstance();
const usersRepo = UsersMongoRepo.getInstance();
const controller = new EuphoniumsController(usersRepo, euphoniumsRepo);

euphoniumsRouter.get('/', logged, controller.getAll.bind(controller));
euphoniumsRouter.get('/:id', logged, controller.get.bind(controller));
euphoniumsRouter.post('/', logged, controller.post.bind(controller));
euphoniumsRouter.patch(
  '/:id',
  logged,
  (req, resp, next) => authorized(req, resp, next, euphoniumsRepo),
  controller.patch.bind(controller)
);
euphoniumsRouter.delete(
  '/:id',
  logged,
  (req, resp, next) => authorized(req, resp, next, euphoniumsRepo),
  controller.delete.bind(controller)
);
