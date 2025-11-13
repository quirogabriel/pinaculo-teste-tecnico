import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { CreditCardController } from './credit-card.controller';
import { CreditCardService } from './credit-card.service';
import { ExternalCreditInfoService } from './external-credit-info.service';

@Module({
  imports: [CacheModule.register()],
  controllers: [CreditCardController],
  providers: [CreditCardService, ExternalCreditInfoService],
})
export class CreditCardModule {}
