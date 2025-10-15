import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { IExternalApiCreditScoreDto } from './dto/credit-score.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ExternalCreditInfoService {
  private axiosInstance: AxiosInstance;
  private apiKey: string | undefined;
  private apiUrl: string | undefined;

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
      baseURL: '',
      headers: {},
    });
  }

  async getCreditInfo(): Promise<IExternalApiCreditScoreDto> {
    return {} as IExternalApiCreditScoreDto;
  }
}
