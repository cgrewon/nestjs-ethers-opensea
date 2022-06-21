import { PartialType } from '@nestjs/mapped-types';
import { CreateFanDto } from './create-fan.dto';

export class UpdateFanDto extends PartialType(CreateFanDto) {}
