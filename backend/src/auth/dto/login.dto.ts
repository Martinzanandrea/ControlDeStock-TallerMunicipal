import { IsString, MinLength } from 'class-validator';

/** DTO para login de usuario */
export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(4)
  password: string;
}
