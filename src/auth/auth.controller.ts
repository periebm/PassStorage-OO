import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('noteuserss')
@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // cadastro
  @Post('sign-up')
  @ApiOperation({ summary: 'Sign up user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User created.' })
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  // login
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign up user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User signed-in.' })
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
