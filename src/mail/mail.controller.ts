import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';



@Controller('mail')
export class MailController {

    constructor(private readonly mailService: MailService) {}

    @Post('test')
    async testEmail(
        @Body('html') html: string,
        @Body('text') text: string,
        @Body('email') email: string,
        @Body('subject') subject: string,
    ){
        const res = await this.mailService.sendEmail(email, subject, html, text);

        return res;
    }

}
