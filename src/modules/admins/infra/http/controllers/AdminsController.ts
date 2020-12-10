import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateAdminService from '@modules/admins/services/CreateAdminService';

class AdminsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { firstname, lastname, email, password, level_access } = request.body;

    const createAdminService = container.resolve(CreateAdminService);
    const admin = await createAdminService.execute({
      firstname,
      lastname,
      email,
      password,
      level_access,
      adminId: String(request.adminId),
    });
    return response.json(admin);
  }
}

export default AdminsController;
