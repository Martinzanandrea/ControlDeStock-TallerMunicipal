import { Test, TestingModule } from '@nestjs/testing';
import { StockIngresadoService } from './stock-ingresado.service';

describe('StockIngresadoService', () => {
  let service: StockIngresadoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockIngresadoService],
    }).compile();

    service = module.get<StockIngresadoService>(StockIngresadoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
