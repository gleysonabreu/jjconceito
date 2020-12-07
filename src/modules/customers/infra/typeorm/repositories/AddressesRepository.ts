import ICreateAddressDTO from '@modules/customers/dtos/ICreateAddressDTO';
import IAddressesRepository from '@modules/customers/repositories/IAddressesRepository';
import { getRepository, Repository } from 'typeorm';
import Address from '../entities/Address';

class AddressesRepository implements IAddressesRepository {
  private ormRepository: Repository<Address>;

  constructor() {
    this.ormRepository = getRepository(Address);
  }

  public async findById(id: string): Promise<Address | undefined> {
    const findAddress = await this.ormRepository.findOne(id);
    return findAddress;
  }

  public async create(addressCustomer: ICreateAddressDTO): Promise<Address> {
    const address = this.ormRepository.create(addressCustomer);

    await this.ormRepository.save(address);
    return address;
  }
}

export default AddressesRepository;
