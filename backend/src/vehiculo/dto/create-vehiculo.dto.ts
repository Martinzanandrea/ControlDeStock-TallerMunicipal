import { IsInt, IsString, Length, IsOptional } from 'class-validator';

/**
 * DTO para crear un nuevo vehículo.
 */
export class CreateVehiculoDto {
  @IsString()
  @Length(1, 10)
  dominio: string;

  @IsString()
  @Length(1, 100)
  modelo: string;

  @IsInt()
  anio: number;

  @IsOptional()
  @IsString()
  @Length(2, 2)
  estado?: string;
}
