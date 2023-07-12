import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChannelUserDto {
    @IsString()
    @ApiProperty({ description: '멤버 인트라 Id', example: 'junhyuki' })
    intraId: string;

    @IsString()
    @ApiProperty({ description: '멤버 닉네임', example: 'jjun' })
    nickName: string;

    @IsString()
    @ApiProperty({ description: '멤버 아바타', example: 'img/avatar.jpeg' })
    avatar: string;
}