import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { EmailService } from '../../core/email/email.service';

@Injectable()
export class CreditCardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}
}
