import { IsOptional, IsString, Matches } from 'class-validator';

export class AuthUpdateUserProfile {
  @IsString()
  @Matches(/^[가-힣a-zA-Z]{2,25}$/, {
    message:
      '이름은 공백, 특수문자, 숫자 없이 2자 이상 25자 이하로 입력해주세요.',
  })
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  password?: string;
}
