import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import axios, { AxiosInstance } from 'axios';
import { IExternalApiCreditScoreDto } from './dto/credit-score.dto';
import { CreditDetails, EnumCpfStatus, EnumCreditDetailsReason } from './dto/user.dto';

@Injectable()
export class ExternalCreditInfoService {
  private readonly axiosInstance: AxiosInstance;
  private readonly apiKey: string | undefined;
  private readonly apiUrl: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('SCORE_API_KEY');
    this.apiUrl = this.configService.get<string>('SCORE_API_URL');

    if (!this.apiKey) {
      throw new InternalServerErrorException('SCORE_API_KEY NÃO ENCONTRADA NA .ENV');
    }

    if (!this.apiUrl) {
      throw new InternalServerErrorException('SCORE_API_URL NÃO ENCONTRADA NA .ENV');
    }

    this.axiosInstance = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'x-api-key': this.apiKey,
      },
    });
  }

  async getCpfInfo(cpf: string): Promise<IExternalApiCreditScoreDto | null> {
    let data;
    try {
      data = await this.axiosInstance
        .get(`/score/${cpf}`)
        .then((res) => res.data as IExternalApiCreditScoreDto);
      return data;
    } catch (err) {
      if (err.response?.status === 404) {
        return null;
      }
      throw new InternalServerErrorException(err);
    }
  }

  getCpfCreditDetails(data: IExternalApiCreditScoreDto | null, user: User): CreditDetails {
    const creditDetails: CreditDetails = {
      access: false,
      limit: 0,
      reason: null,
    };

    if (!data) {
      creditDetails.reason = EnumCreditDetailsReason.INFORMATION_NOT_FOUND;
      return creditDetails;
    }

    const { status, score } = data.data;

    if (status === EnumCpfStatus.BLOCKED) {
      creditDetails.reason = EnumCreditDetailsReason.CPF_BLOCKED;
      return creditDetails;
    }

    if (score < 300) {
      creditDetails.reason = EnumCreditDetailsReason.SCORE_INSUFFICIENT;
      return creditDetails;
    }

    creditDetails.access = true;
    creditDetails.limit = this.validateCreditScore(score, user.income);

    return creditDetails;
  }

  private validateCreditScore(userScore: number, income: number): number {
    if (userScore <= 599) {
      return this.calculeteCreditLimit(income, 0.3);
    }

    if (userScore <= 799) {
      return this.calculeteCreditLimit(income, 0.5);
    }

    return this.calculeteCreditLimit(income, 0.75);
  }

  private calculeteCreditLimit(income: number, score: number): number {
    return Math.round((income / 100) * score);
  }
}
