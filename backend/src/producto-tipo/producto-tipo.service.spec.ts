import { Test, TestingModule } from '@nestjs/testing';
import { ProductoTipoService } from './producto-tipo.service';

describe('ProductoTipoService', () => {
  let service: ProductoTipoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductoTipoService],
    }).compile();

    service = module.get<ProductoTipoService>(ProductoTipoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
