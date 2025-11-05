import { PartialType } from '@nestjs/mapped-types';
import { CreateStockIngresadoDto } from './create-stock-ingresado.dto';

export class UpdateStockIngresadoDto extends PartialType(
  CreateStockIngresadoDto,
) {}
