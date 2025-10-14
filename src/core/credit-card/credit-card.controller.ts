import { Controller } from '@nestjs/common';
import { CreditCardService } from './credit-card.service';

@Controller('credit-card')
export class CreditCardController {
  constructor(private readonly creditCardService: CreditCardService) {}
}
