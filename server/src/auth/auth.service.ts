import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto.js';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto.js';
import { AppLogger } from '../logger/app-logger.service.js';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private logger: AppLogger,
  ) {}

  async register(dto: RegisterDto) {
    this.logger.log(`register: email=${dto.email}`, AuthService.name);
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingUser) {
      this.logger.log(
        `email ${dto.email} already exists, no user was registered`,
        AuthService.name,
      );
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = await this.prisma.user.create({
      data: { email: dto.email, password: passwordHash },
    });

    return this.signToken(user.id, user.email);
  }

  async login(dto: LoginDto) {
    this.logger.log(`login: email=${dto.email}`, AuthService.name);
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      this.logger.log(`no email registered, login failed`, AuthService.name);
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      this.logger.log(`invalid password, login failed`, AuthService.name);
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.signToken(user.id, user.email);
  }

  async getMe(userId: string) {
    this.logger.log(`find user by token: user=${userId}`, AuthService.name);
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      this.logger.log(`user no longer exists, no data returned`, AuthService.name);
      throw new UnauthorizedException('Invalid credentials');
    }
    return { id: user.id, email: user.email };
  }

  async signToken(userId: string, email: string) {
    this.logger.log(`sign token: user=${userId} email=${email}`, AuthService.name);
    const payload = { sub: userId, email };
    return { accessToken: this.jwt.sign(payload, { secret: process.env.JWT_SECRET }) };
  }
}
