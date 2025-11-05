import { PartialType } from '@nestjs/mapped-types';
import { CreateProductoMarcaDto } from './create-producto-marca.dto';

export class UpdateProductoMarcaDto extends PartialType(
  CreateProductoMarcaDto,
) {}
