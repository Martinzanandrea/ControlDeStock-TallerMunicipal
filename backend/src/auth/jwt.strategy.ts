/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * Estrategia JWT (Passport).
 *
 * Extrae el token del header Authorization: Bearer <token>,
 * verifica la firma y transforma el payload en el usuario
 * que se inyecta en request.user.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dev-secret',
    });
  }

  /**
   * Normaliza el payload hacia un objeto de usuario para request.user
   */
  validate(payload: { sub: number; username: string; roles?: string }) {
    return {
      id: payload.sub,
      username: payload.username,
      roles: payload.roles?.split(',') || [],
    };
  }
}
