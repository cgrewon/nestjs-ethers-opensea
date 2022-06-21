import { IsNotEmpty, IsEmail } from 'class-validator';
import { Role } from 'src/enum/role.enum';


export class CreateUserDto {
    @IsNotEmpty()
    readonly username: string;
    
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;
  
    @IsNotEmpty()
    readonly password: string;

    
    readonly first_name: string;

    
    readonly last_name: string;

    
    readonly role: Role;
  
}
