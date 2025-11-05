import { Test, TestingModule } from '@nestjs/testing';
import { StockIngresadoController } from './stock-ingresado.controller';
import { StockIngresadoService } from './stock-ingresado.service';

describe('StockIngresadoController', () => {
  let controller: StockIngresadoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockIngresadoController],
      providers: [StockIngresadoService],
    }).compile();

    controller = module.get<StockIngresadoController>(StockIngresadoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
