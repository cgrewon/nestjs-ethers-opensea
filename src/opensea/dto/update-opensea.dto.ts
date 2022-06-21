import { PartialType } from '@nestjs/mapped-types';
import { CreateOpenseaDto } from './create-opensea.dto';

export class UpdateOpenseaDto extends PartialType(CreateOpenseaDto) {}
