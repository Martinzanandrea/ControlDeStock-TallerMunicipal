import { PartialType } from '@nestjs/mapped-types';
import { CrearProductoTipoDto } from './create-producto-tipo.dto';

export class ActualizarProductoTipoDto extends PartialType(
  CrearProductoTipoDto,
) {}
