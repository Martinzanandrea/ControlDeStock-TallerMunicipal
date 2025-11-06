import { IsString, MinLength, IsOptional } from 'class-validator';

/** DTO para registrar un nuevo usuario */
export class RegisterUserDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(4)
  password: string;

  @IsOptional()
  @IsString()
  nombreCompleto?: string;
}
