import { Router } from 'express';
import { UsersController } from '../controllers/users.controller.js';
import { UsersMongoRepo } from '../repository/user/users.mongo.repo.js';
import createDebug from 'debug';
import { logged } from '../interceptors/logged.js';
const debug = createDebug('W6:router:users');
// eslint-disable-next-line new-cap
export const userRouter = Router();
debug('loaded');
const repo = UsersMongoRepo.getInstance();
const controller = new UsersController(repo);

userRouter.get('/', logged, controller.getAll.bind(controller));
userRouter.post('/login', controller.login.bind(controller));
userRouter.post('/register', controller.register.bind(controller));
