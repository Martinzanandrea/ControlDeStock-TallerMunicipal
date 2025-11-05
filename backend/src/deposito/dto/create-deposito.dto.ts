import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreateDepositoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  ubicacion: string;

  @IsOptional()
  @IsIn(['AC', 'BA']) // AC: Activo, BA: Inactivo
  estado?: string;
}
