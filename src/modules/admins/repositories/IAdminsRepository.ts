import ICreateAdminDTO from '../dtos/ICreateAdminDTO';
import Admin from '../infra/typeorm/entities/Admin';

export default interface IAdminsRepository {
  create(admin: ICreateAdminDTO): Promise<Admin>;
  findById(id: string): Promise<Admin | undefined>;
  findByEmail(email: string): Promise<Admin | undefined>;
}
