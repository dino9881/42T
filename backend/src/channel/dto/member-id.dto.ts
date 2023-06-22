import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MemberIdDto {
    @IsString()
    @ApiProperty({ description: '멤버 인트라 Id', example: 'junhyuki' })
    memberId: string;
}