import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateChannelDto {
  @ApiProperty({ description: '채널명', example: 'channel', required: true })
  @IsString()
  chName: string;

  @IsString()
  @IsOptional()
  chPwd?: string;

  @ApiProperty({ description: '방장 인트라 Id', example: 'heeskim' })
  @IsString()
  @IsOptional()
  ownerId?: string;

  @IsNumber()
  @IsOptional()
  chUserCnt?: number;

  @IsBoolean()
  @IsOptional()
  isDM?: boolean;
}
