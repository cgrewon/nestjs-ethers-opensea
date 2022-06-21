import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeInsert,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    JoinColumn,
    ManyToOne
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Nft {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({nullable: true})
    description: string;

    @Column({ nullable: true })
    external_link: string;

    @Column({ nullable: false })
    asset_local_path: string;

    @Column({ nullable: true })
    adminId: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    
    @ManyToOne(type => User, user => user.nfts)
    user: User;

    
}
