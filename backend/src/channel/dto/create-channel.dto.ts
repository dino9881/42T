import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateChannelDto {
  @IsString()
  @ApiProperty({ description: '채널명' })
  chName: string;

  @ApiProperty({ description: '패스워드' })
  @IsOptional()
  chPwd?: string;

  @IsString()
  @ApiProperty({ description: '인트라 Id' })
  intraId: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: '채널 인원' })
  chUserCnt?: number;
}
