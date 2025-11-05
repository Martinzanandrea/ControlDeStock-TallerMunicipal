import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class CrearProductoTipoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsIn(['AC', 'BA'])
  estado: string;
}
