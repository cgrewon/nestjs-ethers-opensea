import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContractService } from './contract.service';


@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

}
