import { Injectable } from '@nestjs/common';
import { EmailDto, SmsDto } from '@App/shared/modules/messages';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MessagesService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendAuthenticationCode(emailDto: EmailDto): Promise<boolean> {
    const { email, subject, metadata } = emailDto;

    const msg = {
      to: email,
      from: 'morcelimail@gmail.com', //'no-reply@meumercado.com.br',
      subject,
      text: `Seu código de autenticação é: ${metadata.validationCode}`,
      html: `Seu código de autenticação é: <strong>${metadata.validationCode}</strong>.`,
    };

    console.log(msg);

    console.log('send email:', email, '-', subject, '-', metadata);

    return new Promise((resolve) => {
      sgMail
        .send(msg)
        .then(() => resolve(true))
        .catch((error) => {
          console.error(error);
          resolve(false);
        });
    });
  }

  async sendSms(smsDto: SmsDto): Promise<boolean> {
    const { phoneNumber, metadata } = smsDto;
    console.log('send sms:', phoneNumber, '-', metadata);
    return true;
  }
}
