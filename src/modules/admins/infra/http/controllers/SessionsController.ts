import CreateSessionAdminService from '@modules/admins/services/CreateSessionAdminService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const createSessionAdmin = container.resolve(CreateSessionAdminService);
    const token = await createSessionAdmin.execute({ email, password });

    return response.json({ token });
  }
}

export default SessionsController;
