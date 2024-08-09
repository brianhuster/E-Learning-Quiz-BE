import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequest } from './dto/request/login.request';
import { SignInRequest } from './dto/request/signIn.request';
import { AuthGuard } from './auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProfileResponse } from './dto/response/profile.response';
import { RequestWithUser } from 'src/types/types';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({ summary: 'Login' })
  @Post('/login')
  login(@Body() body: LoginRequest) {
    return this.authService.login(body);
  }

  @ApiOperation({ summary: 'Register' })
  @Post('/register')
  register(@Body() body: SignInRequest) {
    return this.authService.signIn(body);
  }

  @ApiOperation({ summary: 'Profile' })
  @UseGuards(AuthGuard)
  @Get('/profile')
  profile(@Request() req: RequestWithUser): ProfileResponse {
    return req.user;
  }
}
