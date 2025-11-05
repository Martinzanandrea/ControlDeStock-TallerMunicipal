import { Test, TestingModule } from '@nestjs/testing';
import { ProductoTipoController } from './producto-tipo.controller';
import { ProductoTipoService } from './producto-tipo.service';

describe('ProductoTipoController', () => {
  let controller: ProductoTipoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductoTipoController],
      providers: [ProductoTipoService],
    }).compile();

    controller = module.get<ProductoTipoController>(ProductoTipoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
