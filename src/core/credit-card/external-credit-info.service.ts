import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { IExternalApiCreditScoreDto } from './dto/credit-score.dto';
import { ConfigService } from '@nestjs/config';

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

  async getCreditInfo(cpf: string): Promise<IExternalApiCreditScoreDto | null> {
    return {} as IExternalApiCreditScoreDto;
  }
}
