import { PartialType } from '@nestjs/mapped-types';
import { CrearProductoDto } from './create-producto.dto';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class ActualizarProductoDto extends PartialType(CrearProductoDto) {}
