import { Router } from 'express';
import customersRouter from '@modules/customers/infra/http/routes/customers.routes';
import sessionRouter from '@modules/customers/infra/http/routes/session.routes';

const routes = Router();

routes.use('/customers', customersRouter);
routes.use('/session', sessionRouter);

export default routes;
