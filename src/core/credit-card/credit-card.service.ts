import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { EmailService } from '../../core/email/email.service';
import { ResponseUserDto } from './dto/user.dto';
import { ExternalCreditInfoService } from './external-credit-info.service';

@Injectable()
export class CreditCardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly externalCreditInfo: ExternalCreditInfoService,
  ) {}

  async listUsers(): Promise<ResponseUserDto> {
    return {} as ResponseUserDto;
  }

  async sendMarketingEmail(params: { userId: string }): Promise<void> {
    return;
  }
}
