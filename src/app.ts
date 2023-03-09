import morgan from 'morgan';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';

import createDebug from 'debug';
import { userRouter as usersRouter } from './routers/users.router.js';
import { CustomError } from './errors/custom.error.js';
const debug = createDebug('W6:app');

export const app = express();

app.disable('x-powered-by');

const corsOptions = {
  origin: '*',
};
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());

app.use(express.static('public'));

debug('running');

app.use('/user', usersRouter);

app.get('/', (_req, resp) => {
  resp.json({
    info: 'Social media',
    endpoints: { users: '/users' },
  });
});

app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (error: CustomError, _req: Request, resp: Response, _next: NextFunction) => {
    debug('Soy el middleware de errores');
    const status = error.statusCode || 500;
    const statusMessage = error.statusMessage || 'Internal server error';
    resp.status(status);
    resp.json({
      error: [
        {
          status,
          statusMessage,
        },
      ],
    });
  }
);
