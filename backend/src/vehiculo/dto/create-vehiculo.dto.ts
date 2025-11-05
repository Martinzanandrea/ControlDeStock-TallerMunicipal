import { IsInt, IsString, Length, IsOptional } from 'class-validator';

export class CreateVehiculoDto {
  @IsString()
  @Length(1, 10)
  dominio: string;

  @IsInt()
  idProductoMarca: number;

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
