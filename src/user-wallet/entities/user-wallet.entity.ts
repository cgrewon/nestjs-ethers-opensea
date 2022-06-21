import {
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne, 
    CreateDateColumn, 
    UpdateDateColumn} from 'typeorm';

import { User } from 'src/user/entities/user.entity';
import { Wallet } from 'src/enum/wallet.enum';

@Entity()
export class UserWallet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: '', unique: true})    
    address: string;
    
    @Column({type: 'enum', enum: Wallet, default: Wallet.MetaMask})    
    wallet: Wallet;

    @Column({type:'int', nullable:true})    
    nonce: number;

    @Column({type:'bool', default:false})    
    is_main: boolean;
          
    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date

    @ManyToOne(type => User, user => user.wallets)
    user: User;

}

