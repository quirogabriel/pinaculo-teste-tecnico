import { User } from '@prisma/client';

//Informações de retorno do usuário da documentação
export interface IUserWithCreditInfoDto extends User {}

export interface ResponseUserDto {
  data: IUserWithCreditInfoDto[];
}
