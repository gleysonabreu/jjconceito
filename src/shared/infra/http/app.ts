import 'reflect-metadata';

import express from 'express';
import 'express-async-errors';
import cors from 'cors';

import createConnection from '@shared/infra/typeorm';
import AppHandleError from '@shared/errors/AppHandleError';
import routes from './routes';

import '@shared/container';

createConnection();

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use(AppHandleError);

export default app;
