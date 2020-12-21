import { Router } from 'express';

import auth from '@shared/infra/http/middlewares/auth';
import ProductsController from '../controllers/ProductsController';

const productsRouter = Router();
const productsController = new ProductsController();

productsRouter.post('/', [auth], productsController.create);
productsRouter.get('/', productsController.index);
productsRouter.get('/:id', productsController.show);
productsRouter.put('/:id', [auth], productsController.update);
productsRouter.delete('/:id', [auth], productsController.delete);

export default productsRouter;
