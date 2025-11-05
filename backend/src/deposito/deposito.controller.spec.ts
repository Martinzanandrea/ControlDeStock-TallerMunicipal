import { Test, TestingModule } from '@nestjs/testing';
import { DepositoController } from './deposito.controller';
import { DepositoService } from './deposito.service';

describe('DepositoController', () => {
  let controller: DepositoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepositoController],
      providers: [DepositoService],
    }).compile();

    controller = module.get<DepositoController>(DepositoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
