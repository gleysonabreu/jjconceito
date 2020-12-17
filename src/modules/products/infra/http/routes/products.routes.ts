import { Router } from 'express';

import auth from '@shared/infra/http/middlewares/auth';
import ProductsController from '../controllers/ProductsController';

const productsRouter = Router();
const productsController = new ProductsController();

productsRouter.post('/', [auth], productsController.create);

export default productsRouter;
