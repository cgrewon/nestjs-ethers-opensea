import { IsNotEmpty, } from 'class-validator';

export class CreateNftDto {
    @IsNotEmpty()
    name: string;
    
    description?: string;
      
    external_link?: string;

    asset_local_path: string;

}
