/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from './public.decorator';

/**
 * Guard de rutas que exige JWT por defecto.
 * Permite omitir protección cuando el handler/clase
 * está marcado con @Public().
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  // Explicit override to satisfy strict type rules
  override canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return super.canActivate(context) as boolean | Promise<boolean>;
  }
}
