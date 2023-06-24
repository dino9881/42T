import { PartialType } from '@nestjs/swagger';
import { MemberInfoDto } from './member-info.dto';

export class UpdateMemberDto extends PartialType(MemberInfoDto) {}
