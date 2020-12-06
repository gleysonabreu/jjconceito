import { Router } from 'express';

import auth from '@shared/infra/http/middlewares/auth';
import CustomersController from '../controller/CustomersController';

const customersRouter = Router();
const customersController = new CustomersController();

customersRouter.post('/', customersController.create);
customersRouter.put('/', [auth], customersController.update);

export default customersRouter;
