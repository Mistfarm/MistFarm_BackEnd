import { Controller, Post, Body } from '@nestjs/common';
import { AuthLoginDto } from './dto/auth.login.dto';
import { AuthSignupDto } from './dto/auth.signup';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  @Post('/auth/login')
  async login(@Body() authLoginDto: AuthLoginDto) {}

  @ApiBearerAuth()
  @Post('/auth/logout')
  async logout() {}

  @Post('/auth/signup')
  async signup(@Body() authSignupDto: AuthSignupDto) {}
}
