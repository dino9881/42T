import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateMemberDto {
  @ApiProperty({
    example: 'heeskim',
    description: '인트라아이디',
    required: true,
  })
  @IsString()
  intraId: string;

  @ApiProperty({
    example: 'hees',
    description: '닉네임',
    required: true,
  })
  @IsString()
  nickName: string;

  @ApiProperty({
    example: 'avatar/avatar.jpeg',
    description: '아바타 경로',
    required: true,
  })
  @IsString()
  avatar: string;
}
