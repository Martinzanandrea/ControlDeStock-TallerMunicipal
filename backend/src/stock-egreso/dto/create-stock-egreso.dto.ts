import {
  IsInt,
  IsNotEmpty,
  Min,
  IsDateString,
  IsIn,
  IsOptional,
} from 'class-validator';

export class CreateStockEgresoDto {
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
  fechaEgreso: string;

  @IsIn(['OFICINA', 'VEHICULO'])
  destinoTipo: string;

  @IsOptional()
  @IsInt()
  idVehiculo?: number;
}
