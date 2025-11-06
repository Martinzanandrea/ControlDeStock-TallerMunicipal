/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async register(
    username: string,
    password: string,
    nombreCompleto?: string,
  ): Promise<User> {
    const existente = await this.userRepo.findOne({ where: { username } });
    if (existente) throw new BadRequestException('Usuario ya existe');
    const passwordHash = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({
      username,
      passwordHash,
      nombreCompleto,
      roles: 'USER',
      estado: 'AC',
    });
    return this.userRepo.save(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { username, estado: 'AC' } });
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id, estado: 'AC' } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }
}
