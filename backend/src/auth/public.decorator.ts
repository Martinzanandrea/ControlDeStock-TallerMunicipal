import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
/**
 * Marca un controlador o handler como público,
 * para que el JwtAuthGuard no exija token.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
