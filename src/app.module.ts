import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma.module';
import { EmailModule } from './core/email/email.module';
import { CreditCardModule } from './core/credit-card/credit-card.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    EmailModule,
    CreditCardModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
