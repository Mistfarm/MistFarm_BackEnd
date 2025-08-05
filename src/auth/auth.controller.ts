import { Controller, Post, Body, Delete, Patch, Get } from '@nestjs/common';
import { AuthLoginDto } from './dto/auth.login.dto';
import { AuthSignupDto } from './dto/auth.signup.dto';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { AuthTokenDto } from './dto/auth.token.dto';
import { AuthNameDto } from './dto/auth.name.dto';

@Controller('auth')
export class AuthController {
  @ApiOkResponse({ type: AuthTokenDto })
  @Post('/auth/login')
  async login(@Body() authLoginDto: AuthLoginDto) {}

  @ApiBearerAuth()
  @Post('/auth/logout')
  async logout() {}

  @ApiOkResponse({ type: AuthTokenDto })
  @Post('/auth/signup')
  async signup(@Body() authSignupDto: AuthSignupDto) {}

  @ApiBearerAuth()
  @Delete('/me')
  async deleteMe() {}

  @ApiBearerAuth()
  @Patch('/name')
  async changeName(@Body() name: AuthNameDto) {}

  @ApiBearerAuth()
  @Patch('/password')
  async changePassword() {}

  @ApiBearerAuth()
  @Get('/me')
  async getMe() {}
}
