import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class MemberInfoDto {
  @ApiProperty({
    example: 'heeskim',
    description: '인트라아이디',
    required: true,
  })
  @IsString()
  intraId: string;

  @ApiProperty({
    example: 'hees',
    description: '닉네임',
    required: true,
  })
  @IsString()
  nickName: string;

  @ApiProperty({
    example: 'avatar/avatar.jpeg',
    description: '아바타 경로',
    required: true,
  })
  @IsString()
  avatar: string;

  @ApiProperty({
    example: 100,
    description: '랭크점수',
    required: true,
  })
  @IsNumber()
  rank: number;

  @ApiProperty({
    example: 1,
    description: '이긴 시합 수',
  })
  @IsNumber()
  winCnt: number;

  @ApiProperty({
    example: 1,
    description: '진 시합 수',
  })
  @IsNumber()
  loseCnt: number;

  @ApiProperty({
    description: '현재 사용중인 refresh token (hash)',
  })
  @IsOptional()
  @IsString()
  currentRefreshToken?: string;

  @ApiProperty({
    type: Date,
    description: 'refresh token expire date',
  })
  @IsOptional()
  @IsDateString()
  currentRefreshTokenExp?: Date;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: '멤버와 친구인지 여부',
  })
  @IsOptional()
  @IsBoolean()
  isFriend?: boolean;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: '멤버를 밴했는지 여부',
  })
  @IsOptional()
  @IsBoolean()
  isBan?: boolean;

  @ApiProperty({
    type: 'Number',
    description: '멤버 상태정보',
    example: 0,
  })
  @IsNumber()
  status: number;

  @ApiProperty({
    type: 'Bool',
    description: '2차인증 활성화 여부',
    example: true,
  })
  @IsBoolean()
  twoFactor?: boolean;
}
