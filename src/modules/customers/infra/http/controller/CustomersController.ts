import { Request, Response } from 'express';

import CreateCustomerService from '@modules/customers/services/CreateCustomerService';
import { container } from 'tsyringe';
import UpdateCustomerService from '@modules/customers/services/UpdateCustomerService';
import customerViews from '../views/customers.view';

export default class CustomersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      firstname,
      lastname,
      password,
      email,
      phone,
      cpf,
      level_access,
    } = request.body;
    const { role } = request;

    const createCustomer = container.resolve(CreateCustomerService);

    const customer = await createCustomer.execute({
      firstname,
      lastname,
      password,
      email,
      phone,
      cpf,
      level_access,
      role,
    });

    return response.status(201).json(customerViews.render(customer));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { firstname, lastname, phone } = request.body;

    const updateCustomerService = container.resolve(UpdateCustomerService);
    const customer = await updateCustomerService.execute({
      firstname,
      lastname,
      phone,
      id: String(request.customerId),
    });

    return response.json(customerViews.render(customer));
  }
}
