import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateChannelDto {
  @IsString()
  @ApiProperty({ description: '채널명', example: 'channel', required: true })
  chName: string;

  @IsOptional()
  chPwd?: string;

  @IsString()
  @ApiProperty({ description: '방장 인트라 Id', example: 'heeskim' })
  operatorId?: string;

  @IsNumber()
  @IsOptional()
  chUserCnt?: number;

  @IsBoolean()
  @IsOptional()
  isDM?: boolean;
}
