import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { CreateGameDto } from './create-game.dto';
import { Type } from 'class-transformer';

export class GameResultDto {
  @ApiProperty({
    example: 1,
    description: '게임 인덱스',
    required: true,
  })
  @IsNumber()
  length: number;

  @ApiProperty({ type: [CreateGameDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateGameDto)
  data: CreateGameDto[];
}
