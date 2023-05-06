import { IsString } from 'class-validator';

export class createDto{
    @IsString()
    readonly name : string;
}
