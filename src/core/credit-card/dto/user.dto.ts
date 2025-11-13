import { CpfDetails } from './credit-score.dto';

export enum EnumCpfStatus {
  REGULAR = 'REGULAR',
  BLOCKED = 'BLOCKED',
}

export enum EnumCreditDetailsReason {
  CPF_BLOCKED = 'CPF bloqueado',
  SCORE_INSUFFICIENT = 'Score insuficiente',
  INFORMATION_NOT_FOUND = 'Informações de score e CPF não encontradas',
}

export interface IUserWithCreditInfoDto {
  id: string;
  cpf: string;
  name: string;
  email: string;
  income: number;
  emailSent: boolean;
  cpfDetails: CpfDetails | null;
  creditDetails: CreditDetails;
}

export interface CreditDetails {
  access: boolean;
  limit: number;
  reason: EnumCreditDetailsReason | null;
}
export interface ResponseUserDto {
  data: IUserWithCreditInfoDto[];
}
