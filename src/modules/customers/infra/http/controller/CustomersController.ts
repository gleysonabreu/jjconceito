import { Request, Response } from 'express';

import CreateCustomerService from '@modules/customers/services/CreateCustomerService';
import { container } from 'tsyringe';
import customerViews from '../views/customers.view';

export default class CustomersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { firstname, lastname, password, email, phone, cpf } = request.body;

    const createCustomer = container.resolve(CreateCustomerService);

    const customer = await createCustomer.execute({
      firstname,
      lastname,
      password,
      email,
      phone,
      cpf,
    });

    return response.status(201).json(customerViews.render(customer));
  }
}
