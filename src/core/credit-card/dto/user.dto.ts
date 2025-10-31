export enum EnumCpfStatus {
  REGULAR = 'REGULAR',
  BLOCKED = 'BLOCKED',
}

export enum EnumCreditDetailsReason {
  CPF_BLOCKED = 'CPF bloqueado',
  SCORE_INSUFFICIENT = 'Score insuficiente',
  INFORMATIONS_NOT_FOUND = 'Informações de score e CPF não encontradas',
}

export interface IUserWithCreditInfoDto {
  id: string;
  cpf: string;
  name: string;
  email: string;
  income: number;
  emailSent: boolean;
  cpfDetails: {
    cpf: string;
    score: number;
    status: EnumCpfStatus;
  };
  creditDetails: {
    access: boolean;
    limit: number;
    reason: EnumCreditDetailsReason | null;
  };
}

export interface ResponseUserDto {
  data: IUserWithCreditInfoDto[];
}
