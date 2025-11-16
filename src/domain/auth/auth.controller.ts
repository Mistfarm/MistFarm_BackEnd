import {
  Controller,
  Post,
  Body,
  Delete,
  Patch,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthLoginDto } from './dto/auth.login.dto';
import { AuthSignupDto } from './dto/auth.signup.dto';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { AuthTokenDto } from './dto/auth.token.dto';
import { AuthUpdateUserProfile } from './dto/auth.update.user.profile';
import { AuthPersonalInformationDto } from './dto/auth.personal.information.dto';
import { AuthService } from './auth.service';
import { DecoraterUser } from './decorater/decorater.user';
import { UserEntity } from '../../DB/entity/user.entity';
import { AuthJwtGuard } from './jwt/auth.jwt.guard';
import { AuthLogoutDto } from './dto/auth.logout.dto';
import { AuthRefreshTokenDto } from './dto/auth.refreshToken.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOkResponse({ type: AuthTokenDto })
  @Post('/auth/login')
  async login(@Body() authLoginDto: AuthLoginDto) {
    return await this.authService.login(authLoginDto);
  }

  @UseGuards(AuthJwtGuard)
  @ApiBearerAuth()
  @Post('/auth/logout')
  async logout(@Body() authLogoutDto: AuthLogoutDto) {
    await this.authService.logout(authLogoutDto);
  }

  @ApiOkResponse({ type: AuthTokenDto })
  @Post('/auth/signup')
  async signup(@Body() authSignupDto: AuthSignupDto) {
    await this.authService.signup(authSignupDto);
  }

  @UseGuards(AuthJwtGuard)
  @ApiBearerAuth()
  @Delete('/me')
  async deleteMe(@DecoraterUser() user: UserEntity) {
    await this.authService.deleteUser(user);
  }

  @UseGuards(AuthJwtGuard)
  @ApiBearerAuth()
  @Patch('/me')
  async updateUserProfile(
    @DecoraterUser() user: UserEntity,
    @Body() authUpdateUserProfile: AuthUpdateUserProfile,
  ) {
    await this.authService.updateUserProfile(user, authUpdateUserProfile);
  }

  @UseGuards(AuthJwtGuard)
  @ApiOkResponse({ type: AuthPersonalInformationDto })
  @ApiBearerAuth()
  @Get('/me')
  getMe(@DecoraterUser() user: UserEntity): AuthPersonalInformationDto {
    return this.authService.personalInformation(user);
  }

  @UseGuards(AuthJwtGuard)
  @Get('/test')
  test(@DecoraterUser() user: UserEntity) {
    return user;
  }

  @Post('/auth/refresh')
  @ApiOkResponse({ type: AuthTokenDto })
  async reissueAccessToken(@Body() refreshTokenDto: AuthRefreshTokenDto) {
    return this.authService.reissueAccessToken(refreshTokenDto);
  }
}
