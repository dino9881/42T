import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ChannelUserDto {
    @ApiProperty({ description: '멤버 인트라 Id', example: 'junhyuki' })
    @IsString()
    intraId: string;

    @ApiProperty({ description: '멤버 닉네임', example: 'jjun' })
    @IsString()
    @IsOptional()
    nickName: string;

    @ApiProperty({ description: '멤버 아바타', example: 'img/avatar.jpeg' })
    @IsString()
    @IsOptional()
    avatar: string;
}