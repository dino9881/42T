import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MessageDto {
    @IsString()
    @ApiProperty({ description: '보내는 메세지', example: 'hi' })
    message: string;
}
