import CreateAddressService from '@modules/customers/services/CreateAddressService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class AddressesController {
  async create(request: Request, response: Response): Promise<Response> {
    const {
      address,
      number,
      complement,
      district,
      city,
      state,
      country,
      zipcode,
    } = request.body;

    const createAddressService = container.resolve(CreateAddressService);
    const addressCustomer = await createAddressService.execute({
      address,
      number,
      complement,
      district,
      city,
      country,
      state,
      zipcode,
      customer: {
        id: String(request.customerId),
      },
    });

    return response.json({ addressCustomer });
  }
}

export default AddressesController;
