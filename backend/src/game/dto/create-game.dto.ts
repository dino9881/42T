import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateGameDto {
  @ApiProperty({
    example: 'heeskim',
    description: '게임을 이긴 유저의 인트라아이디',
    required: true,
  })
  @IsString()
  winnerId: string;

  @ApiProperty({
    example: 'yyoo',
    description: '게임을 진 유저의 인트라아이디',
    required: true,
  })
  @IsString()
  loserId: string;

  @ApiProperty({
    example: 1,
    description: '게임을 이긴 유저의 점수',
    required: true,
  })
  @IsNumber()
  winnerScore: number;

  @ApiProperty({
    example: 2,
    description: '게임을 진 유저의 점수',
    required: true,
  })
  @IsNumber()
  loserScore: number;
}
