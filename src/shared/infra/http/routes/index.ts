import { Router } from 'express';
import customersRouter from '@modules/customers/infra/http/routes/customers.routes';
import sessionRouter from '@modules/customers/infra/http/routes/session.routes';
import addressesRouter from '@modules/customers/infra/http/routes/addresses.routes';

import categoriesRouter from '@modules/products/infra/http/routes/categories.routes';
import adminsRoutes from '@modules/admins/infra/http/routes/admins.routes';
import sessionsAdminRoutes from '@modules/admins/infra/http/routes/sessions.routes';

const routes = Router();

routes.use('/customers', customersRouter);
routes.use('/session', sessionRouter);
routes.use('/customers/addresses', addressesRouter);
routes.use('/products/categories', categoriesRouter);
routes.use('/admins', adminsRoutes);
routes.use('/admins/session', sessionsAdminRoutes);

export default routes;
