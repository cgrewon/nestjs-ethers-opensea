import { IsNotEmpty } from "class-validator";
import { LogType } from "src/enum/log_type";
import { NetMode } from "src/enum/net_mode.enum";

export class CreateLogDto {
  content: string;
  fetch_nft_limit?: number;
  fetch_nft_offset?: number;
  log_type: LogType;  
   
}
