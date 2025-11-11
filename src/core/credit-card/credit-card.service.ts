import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { EmailService } from '../../core/email/email.service';
import { PrismaService } from '../../database/prisma.service';
import { CpfDetails, IExternalApiCreditScoreDto } from './dto/credit-score.dto';
import { IUserWithCreditInfoDto, ResponseUserDto } from './dto/user.dto';
import { ExternalCreditInfoService } from './external-credit-info.service';

@Injectable()
export class CreditCardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly externalCreditInfo: ExternalCreditInfoService,
  ) {}

  async listUsers(): Promise<ResponseUserDto> {
    const users: User[] = await this.prisma.user.findMany();

    const userWithCreditInfoDto: IUserWithCreditInfoDto[] = await Promise.all(
      users.map(async (user) => {
        const externalApiCreditScoreDto: IExternalApiCreditScoreDto | null =
          await this.externalCreditInfo.getCpfInfo(user.cpf);

        const cpfDetails: CpfDetails | null = externalApiCreditScoreDto?.data ?? null;
        const creditDetails = this.externalCreditInfo.getCpfCreditDetails(
          externalApiCreditScoreDto,
          user,
        );

        const data: IUserWithCreditInfoDto = {
          ...user,
          cpfDetails,
          creditDetails,
        };

        return data;
      }),
    );

    const user: ResponseUserDto = { data: userWithCreditInfoDto };
    return user;
  }

  async sendMarketingEmail(params: { userId: string }): Promise<void> {
    const { userId } = params;
    const user: User | null = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.emailSent) {
      throw new BadRequestException('Email already sent');
    }

    const externalApiCreditScoreDto: IExternalApiCreditScoreDto | null =
      await this.externalCreditInfo.getCpfInfo(user.cpf);
    const creditDetails = this.externalCreditInfo.getCpfCreditDetails(
      externalApiCreditScoreDto,
      user,
    );

    if (!creditDetails.access) {
      throw new BadRequestException(
        `User is not eligible for a credit card: ${creditDetails.reason}`,
      );
    }

    const emailSent = await this.emailService.sendMail({
      userId,
      creditLimit: creditDetails.limit,
    });

    if (!emailSent.success) {
      throw new InternalServerErrorException('Failed to send email');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { emailSent: true },
    });
  }
}
