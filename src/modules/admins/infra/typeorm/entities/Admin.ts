import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

@Entity('admins')
class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  public async session(): Promise<string> {
    return jwt.sign(
      {
        firstname: this.firstname,
        lastname: this.lastname,
        email: this.email,
        id: this.id,
      },
      String(process.env.JWT_SECRET_TOKEN_ADMIN),
      {
        expiresIn: '1h',
      },
    );
  }

  public async encryptPassword(): Promise<void> {
    this.password = await bcrypt.hash(
      this.password,
      Number(process.env.BCRYPT_SALT_ROUNDS_ADMIN),
    );
  }

  public async comparePassword(password: string): Promise<boolean> {
    const comparePassword = await bcrypt.compare(password, this.password);
    return comparePassword;
  }
}

export default Admin;
