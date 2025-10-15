import { Module } from '@nestjs/common';
import { CreditCardService } from './credit-card.service';
import { CreditCardController } from './credit-card.controller';
import { ExternalCreditInfoService } from './external-credit-info.service';

@Module({
  controllers: [CreditCardController],
  providers: [CreditCardService, ExternalCreditInfoService],
})
export class CreditCardModule {}
