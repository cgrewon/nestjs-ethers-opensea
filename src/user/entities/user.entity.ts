import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeInsert,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    JoinColumn
} from 'typeorm';
import { Role } from 'src/enum/role.enum';
import * as argon2 from 'argon2';
import { IsEmail } from 'class-validator';
import { UserWallet } from 'src/user-wallet/entities/user-wallet.entity';
import { Exclude } from 'class-transformer';
import { Nft } from 'src/nft/entities/nft.entity';


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @IsEmail()
    email: string;

    @Column({nullable: true})
    @Exclude()
    password: string;

    @Column({ unique: false })
    username: string;

    @Column({ nullable: true })
    first_name: string;

    @Column({ nullable: true })
    last_name: string;

    @Column({ nullable: true, type:'text' })
    bio: string;

    @Column({ nullable: true, type:'text' })
    avatar: string;

    @Column({nullable: true})
    @Exclude()
    code: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.Fan,
    })
    role: Role;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @BeforeInsert()
    async hashPassword() {
        this.password = await argon2.hash(this.password);
    }

    @OneToMany((type) => UserWallet, (userWallet) => userWallet.user)
    @JoinColumn()
    wallets: UserWallet[];

    @OneToMany((type) => Nft, (nft) => nft.user)
    @JoinColumn()
    nfts: Nft[];
   
}
