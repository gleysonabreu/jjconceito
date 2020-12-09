import ICreateAddressDTO from '@modules/customers/dtos/ICreateAddressDTO';
import IAddressesRepository from '@modules/customers/repositories/IAddressesRepository';
import { getRepository, Repository } from 'typeorm';
import Address from '../entities/Address';

class AddressesRepository implements IAddressesRepository {
  private ormRepository: Repository<Address>;

  constructor() {
    this.ormRepository = getRepository(Address);
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async update(address: Address): Promise<Address> {
    const addressUpdated = await this.ormRepository.save({ ...address });
    return addressUpdated;
  }

  public async findById(id: string): Promise<Address | undefined> {
    const findAddress = await this.ormRepository.findOne(id, {
      relations: ['customer'],
    });
    return findAddress;
  }

  public async create(addressCustomer: ICreateAddressDTO): Promise<Address> {
    const address = this.ormRepository.create(addressCustomer);

    await this.ormRepository.save(address);
    return address;
  }
}

export default AddressesRepository;
