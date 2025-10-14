import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma.module';
import { EmailModule } from './core/email/email.module';
import { CreditCardModule } from './core/credit-card/credit-card.module';

@Module({
  imports: [PrismaModule, EmailModule, CreditCardModule],
})
export class AppModule {}
