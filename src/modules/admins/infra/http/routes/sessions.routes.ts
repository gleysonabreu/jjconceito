import { Router } from 'express';
import SessionsController from '../controllers/SessionsController';

const sessionsAdminRoutes = Router();
const sessionAdminController = new SessionsController();

sessionsAdminRoutes.post('/', sessionAdminController.create);

export default sessionsAdminRoutes;
