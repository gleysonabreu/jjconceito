import { Router } from 'express';
import customersRouter from '@modules/customers/infra/http/routes/customers.routes';

const routes = Router();

routes.use('/customers', customersRouter);

export default routes;
