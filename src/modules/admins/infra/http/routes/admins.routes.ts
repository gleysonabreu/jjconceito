import { Router } from 'express';
import authAdmin from '@shared/infra/http/middlewares/authAdmin';
import AdminsController from '../controllers/AdminsController';

const adminsRoutes = Router();
const adminsController = new AdminsController();

adminsRoutes.post('/', [authAdmin], adminsController.create);

export default adminsRoutes;
