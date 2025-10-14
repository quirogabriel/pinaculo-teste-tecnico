import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class EmailService {
  constructor(private readonly prisma: PrismaService) {}

  async sendMail({ userId }: { userId: string; creditLimit: number }) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
      },
    });

    if (!user) {
      return {
        userId,
        success: false,
      };
    }

    return {
      userId,
      success: true,
    };
  }
}
