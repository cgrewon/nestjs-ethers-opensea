import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SesService, SesEmailOptions } from '@nextnm/nestjs-ses';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class MailService {
  
  constructor(
    private sesService: SesService,
  ) {}

  async sendEmail(userEmail: string, subject: string, html: string,text: string ) {
    if(!process.env.MAIL_FROM) {
      Logger.warn('Mail is not configured');
      
      return null;
    }
    try {
   
        const options: SesEmailOptions = {
          from: process.env.MAIL_FROM,
          to: userEmail,
          subject: subject,
          html: html,
          // replyTo: 'No Reply',
          // cc: '',
          // bcc: [''],
          text: text,
        };

        const res = await this.sesService.sendEmail(options);
        return res;
     
    } catch (ex) {
      console.log('sendEMINotifyEmail exception: ', ex);
      return {
        status: HttpStatus.BAD_REQUEST,
        error: ex,
      };
    }
  }

  async sendMagicLink(email: string, token: string): Promise<any>{
    try {
      const link = `${process.env.APP_HOST}email/login/${token}`
      let html = `
      <p>Hello,</p>
      <p>You have requested us to send a magic link to automatically sign in to ${process.env.PLATFORM_NAME}.</p>
      <p>
        <a href="${link}" style="background-color: green; color:white;height:40px; border-radius: 5px; padding: 10px ">
          Login via Email
        </a>          
        <p style="font-size:9px; color:gray">if above button is not working you can use below link directly.</p>
        <p style="font-size:9px; color:blue">${link}</p>
      </p>

      <p>If you did not request this email you can safely ignore it.</p>
      `;


      let text = `
      You have requested us to send a magic link to automatically sign in to ${process.env.PLATFORM_NAME}.
      You can use below link directly.
      ${link}
      `;

      const options: SesEmailOptions = {
        from: process.env.MAIL_FROM,
        to: email,
        subject: 'Login via Email',
        html: html,
        text: text,
      };

      const res = await this.sesService.sendEmail(options);
      return res;
        
  } catch (ex) {
    return null;
  }


  }

  async sendPwdResetCodeEmail(user: User, token: string): Promise<any> {
    try {

        let html = `
        <p>Hey ${user.username},</p>
        <p>Please use this code to reset your password.</p>
        <p>
          <strong>${token}</strong>  
        </p>
        <p>If you did not request this email you can safely ignore it.</p>
        `;


        let text = `
        Hey ${user.username}, Please use this code to reset your password. CODE: ${token},
        If you did not request this email you can safely ignore it.
        `;

        const options: SesEmailOptions = {
          from: process.env.MAIL_FROM,
          to: user.email,
          subject: 'Reset Password',
          html: html,
          text: text,
        };

        const res = await this.sesService.sendEmail(options);
        return res;
          
    } catch (ex) {
      return null;
    }
  }



  async sendConfirmEmail(user: User, token: string): Promise<any> {
    try {

      const url = `${process.env.HOST}api/user/auth/active/` + token;
      

        let html = `
        <p>Hey {{ username }},</p>
        <h3>
          Welcome to ${process.env.PLATFORM_NAME}!
        </h3>
        <p>Please activate your account by click this link.</p>
        <p>
          <a href="{{url}}">
            Activate
          </a>  
        </p>
        <p>If you did not request this email you can safely ignore it.</p>
        `;

        html = html.replace(/{{url}}/g, url);
        html = html.replace(/{{ username }}/g, user.username);

        let text = `
        Hey ${user.username}, Welcome to ${process.env.PLATFORM_NAME}! Please activate your account by click this link. ${url} 
        If you did not request this email you can safely ignore it.
        `;

        const options: SesEmailOptions = {
          from: process.env.MAIL_FROM,
          to: user.email,
          subject: 'Active account',
          html: html,
          text: text,
        };

        const res = await this.sesService.sendEmail(options);
        return res;
      
      
    } catch (ex) {
      return null;
    }
  }





}
