import { Controller, Post, Body, Delete, Patch, Get } from '@nestjs/common';
import { AuthLoginDto } from './dto/auth.login.dto';
import { AuthSignupDto } from './dto/auth.signup.dto';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { AuthTokenDto } from './dto/auth.token.dto';
import { AuthNameDto } from './dto/auth.name.dto';
import { AuthPasswordUpdateDto } from './dto/auth.password.update.dto';
import { AuthPersonalInformationDto } from './dto/auth.personal.information.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOkResponse({ type: AuthTokenDto })
  @Post('/auth/login')
  async login(@Body() authLoginDto: AuthLoginDto) {
    await this.authService.login(authLoginDto);
  }

  @ApiBearerAuth()
  @Post('/auth/logout')
  async logout() {}

  @ApiOkResponse({ type: AuthTokenDto })
  @Post('/auth/signup')
  async signup(@Body() authSignupDto: AuthSignupDto) {
    await this.authService.signup(authSignupDto);
  }

  @ApiBearerAuth()
  @Delete('/me')
  async deleteMe() {}

  @ApiBearerAuth()
  @Patch('/name')
  async changeName(@Body() authNameDto: AuthNameDto) {}

  @ApiBearerAuth()
  @Patch('/password')
  async changePassword(@Body() authPasswordUpdateDto: AuthPasswordUpdateDto) {}

  @ApiOkResponse({ type: AuthPersonalInformationDto })
  @ApiBearerAuth()
  @Get('/me')
  async getMe() {}
}
