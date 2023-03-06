import morgan from 'morgan';
import cors from 'cors';
import express from 'express';

import createDebug from 'debug';
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

app.get('/', (_req, resp) => {
  resp.json({
    info: 'Social media',
    endpoints: { things: '/members' },
  });
});
