import { Injectable } from '@nestjs/common';
import { EmailDto, SmsDto } from '@App/shared/modules/messages';

@Injectable()
export class MessagesService {
  async sendEmail(emailDto: EmailDto): Promise<boolean> {
    const { email, subject, metadata } = emailDto;
    console.log('send email:', email, '-', subject, '-', metadata);
    return true;
  }

  async sendSms(smsDto: SmsDto): Promise<boolean> {
    const { phoneNumber, metadata } = smsDto;
    console.log('send sms:', phoneNumber, '-', metadata);
    return true;
  }
}
