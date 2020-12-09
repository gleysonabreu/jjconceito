import CreateSessionCustomer from '@modules/customers/services/CreateSessionCustomer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class SessionController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const createSessionCustomer = container.resolve(CreateSessionCustomer);
    const token = await createSessionCustomer.execute({ email, password });

    return response.json({ token });
  }
}

export default SessionController;
