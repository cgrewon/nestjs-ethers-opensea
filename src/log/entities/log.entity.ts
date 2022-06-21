import { LogType } from "src/enum/log_type";
import { NetMode } from "src/enum/net_mode.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Log {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true, type:'text' })
  content: string;
  
  @Column({
    type:'enum',
    enum: NetMode,
    default: NetMode.Test
  })
  net_mode: NetMode;
 

  @Column({nullable: true})
  fetch_nft_limit: number;
  
  @Column({nullable: true})
  fetch_nft_offset: number;

  @Column({
    type:'enum',
    enum: LogType,
    default: LogType.General
  })
  log_type: LogType;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

}
