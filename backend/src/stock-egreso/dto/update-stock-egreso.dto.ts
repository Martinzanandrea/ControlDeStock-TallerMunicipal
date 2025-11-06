import { PartialType } from '@nestjs/mapped-types';
import { CreateStockEgresoDto } from './create-stock-egreso.dto';

export class UpdateStockEgresoDto extends PartialType(CreateStockEgresoDto) {}
