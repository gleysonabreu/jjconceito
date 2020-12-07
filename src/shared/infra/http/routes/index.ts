import { Router } from 'express';
import customersRouter from '@modules/customers/infra/http/routes/customers.routes';
import sessionRouter from '@modules/customers/infra/http/routes/session.routes';
import addressesRouter from '@modules/customers/infra/http/routes/addresses.routes';

const routes = Router();

routes.use('/customers', customersRouter);
routes.use('/session', sessionRouter);
routes.use('/customers/addresses', addressesRouter);

export default routes;
