import { IsNotEmpty, IsString, IsNumber, IsIn } from 'class-validator';

export class CrearProductoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsString()
  descripcion?: string;

  @IsNotEmpty()
  @IsNumber()
  tipoId: number;

  @IsNotEmpty()
  @IsNumber()
  marcaId: number;

  @IsNotEmpty()
  @IsNumber()
  depositoId: number;

  @IsNumber()
  stockActual?: number;

  @IsIn(['AC', 'BA'])
  estado: string;
}
