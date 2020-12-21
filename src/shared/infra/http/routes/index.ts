import { Router } from 'express';
import customersRouter from '@modules/customers/infra/http/routes/customers.routes';
import sessionRouter from '@modules/customers/infra/http/routes/session.routes';
import addressesRouter from '@modules/customers/infra/http/routes/addresses.routes';

import categoriesRouter from '@modules/products/infra/http/routes/categories.routes';
import productsRouter from '@modules/products/infra/http/routes/products.routes';

const routes = Router();

routes.use('/customers', customersRouter);
routes.use('/session', sessionRouter);
routes.use('/customers/addresses', addressesRouter);
routes.use('/products', productsRouter);
routes.use('/products/categories', categoriesRouter);

export default routes;
