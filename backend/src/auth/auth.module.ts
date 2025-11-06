/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';

/**
 * Módulo de autenticación.
 * Configura JWT (secreto + expiración) y expone
 * el servicio y controlador de auth.
 */
@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => {
        const secret = process.env.JWT_SECRET || 'dev-secret';
        // usar segundos (número) para cumplir tipos
        const expiresInEnv = process.env.JWT_EXPIRES;
        const expiresIn =
          expiresInEnv && !isNaN(Number(expiresInEnv))
            ? Number(expiresInEnv)
            : 3600; // 1h
        return {
          secret,
          signOptions: { expiresIn },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
