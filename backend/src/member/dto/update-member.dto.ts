import { PartialType } from '@nestjs/swagger';
import { CreateMemberDto } from './member.dto';

export class UpdateMemberDto extends PartialType(CreateMemberDto) {}
