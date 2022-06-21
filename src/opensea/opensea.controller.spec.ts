import { Test, TestingModule } from '@nestjs/testing';
import { OpenseaController } from './opensea.controller';
import { OpenseaService } from './opensea.service';

describe('OpenseaController', () => {
  let controller: OpenseaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpenseaController],
      providers: [OpenseaService],
    }).compile();

    controller = module.get<OpenseaController>(OpenseaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
