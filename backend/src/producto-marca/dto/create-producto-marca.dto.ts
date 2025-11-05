import { IsString, IsOptional, Length } from 'class-validator';

export class CreateProductoMarcaDto {
  @IsString()
  @Length(2, 100)
  nombre: string;

  @IsOptional()
  @IsString()
  estado?: string;
}
