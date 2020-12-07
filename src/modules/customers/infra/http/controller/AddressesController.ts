import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAddressService from '@modules/customers/services/CreateAddressService';
import UpdateAddressService from '@modules/customers/services/UpdateAddressService';
import addressesView from '@modules/customers/infra/http/views/addresses.view';
import DeleteAddressService from '@modules/customers/services/DeleteAddressService';

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

  public async update(request: Request, response: Response): Promise<Response> {
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
    const { id } = request.params;

    const updateAddressService = container.resolve(UpdateAddressService);
    const addressUpdated = await updateAddressService.execute({
      address,
      number,
      complement,
      district,
      city,
      state,
      country,
      zipcode,
      id,
      customerId: String(request.customerId),
    });

    return response.json(addressesView.render(addressUpdated));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const customerId = String(request.customerId);

    const deleteAddressService = container.resolve(DeleteAddressService);
    await deleteAddressService.execute({ id, customerId });

    return response.sendStatus(204);
  }
}

export default AddressesController;
