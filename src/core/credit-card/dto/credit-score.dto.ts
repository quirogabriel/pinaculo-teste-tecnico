import { EnumCpfStatus } from './user.dto';

export interface IExternalApiCreditScoreDto {
  data: CpfDetails;
}

export interface CpfDetails {
  cpf: string;
  score: number;
  status: EnumCpfStatus;
}
