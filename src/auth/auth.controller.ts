import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) { }

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const existingUser = await this.userService.findOneByEmail(email);
    if (existingUser) {
      throw new BadRequestException({
        statusCode: 400,
        message: {
          email: ['Email already exists'],
        },
      });
    }
    if (createUserDto.password !== createUserDto.passwordConfirmation) {
      throw new BadRequestException({
        statusCode: 400,
        message: {
          passwordConfirmation: ['Password confirmation does not match'],
        },
      });
    }
    const user = await this.userService.create(createUserDto);

    return this.authService.makeResponseLogin(user);
  }


  @Post('login')
  async login(@Body() loginCoach: LoginUserDto) {
    const user = await this.userService.validateUser(
      loginCoach.email,
      loginCoach.password,
    );

    if (!user) {
      throw new BadRequestException({
        statusCode: 400,
        message: {
          auth_error: 'validate.data_auth_not_valid',
        },
      });
    }

    return this.authService.makeResponseLogin(user);
  }
}
