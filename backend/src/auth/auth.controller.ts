import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { Public } from './public.decorator';

/**
 * Endpoints públicos para autenticación de usuarios.
 * - POST /auth/login
 * - POST /auth/register
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  /**
   * Login público: devuelve access_token y datos básicos del usuario.
   */
  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.username, dto.password);
  }

  /**
   * Registro público: crea un nuevo usuario.
   */
  @Public()
  @Post('register')
  register(@Body() dto: RegisterUserDto) {
    return this.auth.register(dto.username, dto.password, dto.nombreCompleto);
  }
}
