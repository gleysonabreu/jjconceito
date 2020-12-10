import ICreateAdminDTO from '@modules/admins/dtos/ICreateAdminDTO';
import IAdminsRepository from '@modules/admins/repositories/IAdminsRepository';
import { getRepository, Repository } from 'typeorm';
import Admin from '../entities/Admin';

class AdminsRepository implements IAdminsRepository {
  private ormRepository: Repository<Admin>;

  constructor() {
    this.ormRepository = getRepository(Admin);
  }

  public async findByEmail(email: string): Promise<Admin | undefined> {
    const admin = await this.ormRepository.findOne({
      where: {
        email,
      },
    });
    return admin;
  }

  public async findById(id: string): Promise<Admin | undefined> {
    const admin = await this.ormRepository.findOne(id);
    return admin;
  }

  public async create(admin: ICreateAdminDTO): Promise<Admin> {
    const adminCreate = this.ormRepository.create(admin);

    const adminCreated = await this.ormRepository.save(adminCreate);
    return adminCreated;
  }
}

export default AdminsRepository;
