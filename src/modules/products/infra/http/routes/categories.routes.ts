import { Router } from 'express';

import auth from '@shared/infra/http/middlewares/auth';
import CategoriesController from '../controllers/CategoriesController';

const categoriesRouter = Router();
const categoriesController = new CategoriesController();

categoriesRouter.post('/', categoriesController.create);
categoriesRouter.get('/:id', categoriesController.show);

export default categoriesRouter;
