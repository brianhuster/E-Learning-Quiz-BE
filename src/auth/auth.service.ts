import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInRequest } from './dto/request/signIn.request';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginRequest } from './dto/request/login.request';
import { LoginResponse } from './dto/response/login.response';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from 'src/database/schema/users/user.schema';
import { ProfileResponse } from './dto/response/profile.response';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async signIn(signInRequest: SignInRequest): Promise<void> {
    // check regex email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signInRequest.email))
      throw new BadRequestException('Invalid email');
    const user = await this.usersService.findByEmail(signInRequest.email);
    if (user) {
      throw new UnauthorizedException('Email exists');
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(signInRequest.password, salt);
    await this.usersService.create({
      ...signInRequest,
      hashedPassword,
    });
  }

  async validateUser({ email, password }: LoginRequest): Promise<UserDocument> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email not found');
    }
    const isPasswordMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid password');
    }
    return user;
  }

  async login({ email, password }: LoginRequest): Promise<LoginResponse> {
    const user = await this.validateUser({ email, password });
    const jwtPayload: ProfileResponse = {
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      id: user._id.toString(),
    };
    return {
      token: this.jwtService.sign(jwtPayload),
    };
  }
}
