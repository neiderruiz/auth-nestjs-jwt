import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';
export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsOptional()
    readonly name: string;

    @IsNotEmpty()
    @Length(8, 20)
    readonly password: string;

    @IsNotEmpty()
    @Length(8, 20)
    readonly passwordConfirmation: string;

}
