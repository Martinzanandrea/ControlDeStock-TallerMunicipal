import { Test, TestingModule } from '@nestjs/testing';
import { ProductoMarcaService } from './producto-marca.service';

describe('ProductoMarcaService', () => {
  let service: ProductoMarcaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductoMarcaService],
    }).compile();

    service = module.get<ProductoMarcaService>(ProductoMarcaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
