import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MessageDto {
    @IsString()
    @ApiProperty({ description: '멤버 인트라 Id', example: 'junhyuki' })
    memberId: string;

    @IsString()
    @ApiProperty({ description: '보내는 메세지', example: 'hi' })
    message: string;
}
