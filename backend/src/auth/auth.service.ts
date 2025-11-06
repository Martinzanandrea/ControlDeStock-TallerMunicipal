/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

/**
 * Servicio de autenticación.
 *
 * Encapsula la lógica para:
 * - Validar credenciales (usuario + password).
 * - Generar tokens JWT en login.
 * - Registrar nuevos usuarios con hash seguro.
 *
 * Devuelve información básica del usuario junto con el access_token.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly users: UserService,
    private readonly jwt: JwtService,
  ) {}

  /**
   * Valida credenciales contra la base de datos.
   * Retorna el usuario si coinciden, si no, null.
   */
  async validateUser(username: string, password: string) {
    const user = await this.users.findByUsername(username);
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return null;
    return user;
  }

  /**
   * Realiza el proceso de login: verifica credenciales y
   * emite un JWT con id (sub), username y roles.
   * Lanza UnauthorizedException si falla.
   */
  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    const payload = {
      sub: user.id,
      username: user.username,
      roles: user.roles,
    };
    return {
      access_token: await this.jwt.signAsync(payload),
      user: {
        id: user.id,
        username: user.username,
        roles: user.roles.split(','),
      },
    };
  }

  /**
   * Registra un nuevo usuario con hash de contraseña.
   */
  async register(username: string, password: string, nombre?: string) {
    const user = await this.users.register(username, password, nombre);
    return { id: user.id, username: user.username };
  }
}
