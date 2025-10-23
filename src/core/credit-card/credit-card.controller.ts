import { Controller, Get, Post } from '@nestjs/common';
import { CreditCardService } from './credit-card.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Credit Card')
@Controller('credit-card')
export class CreditCardController {
  constructor(private readonly creditCardService: CreditCardService) {}

  @Get('users-status')
  async listUsers() {}

  @Post('user/:userId/send-marketing-email')
  async sendMarketingEmail() {}
}
