import { Router } from 'express';

import auth from '@shared/infra/http/middlewares/auth';
import AddressesController from '../controller/AddressesController';

const addressesRouter = Router();
const addressesController = new AddressesController();

addressesRouter.post('/', [auth], addressesController.create);
addressesRouter.put('/:id', [auth], addressesController.update);
addressesRouter.delete('/:id', [auth], addressesController.delete);

export default addressesRouter;
