import { Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreditCardService } from './credit-card.service';

@ApiTags('Credit Card')
@Controller('credit-card')
export class CreditCardController {
  constructor(private readonly creditCardService: CreditCardService) {}

  @Get('users-status')
  async listUsers() {
    return await this.creditCardService.listUsers();
  }

  @Post('user/:userId/send-marketing-email')
  @HttpCode(HttpStatus.OK)
  async sendMarketingEmail(@Param('userId') userId: string) {
    return await this.creditCardService.sendMarketingEmail({ userId });
  }
}
