import { IsInt, IsNotEmpty, IsDateString, Min, IsIn } from 'class-validator';

export class CreateStockIngresadoDto {
  @IsInt()
  @IsNotEmpty()
  idProducto: number;

  @IsInt()
  @IsNotEmpty()
  idDeposito: number;

  @IsInt()
  @Min(1)
  cantidad: number;

  @IsDateString()
  fechaIngreso: string;

  @IsIn(['AC', 'BA'])
  estado: string;
}
