import { HttpStatus } from "@nestjs/common";

export interface IHttpResponse {
    status: number;
    data?: any;
    error?: string;    
}