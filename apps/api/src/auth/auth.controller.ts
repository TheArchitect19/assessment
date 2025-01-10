import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Response } from 'express';
import OK from 'response/Ok';
import { LoginDTO, SingupDTO } from './dto/auth.dto';
import errorHandler from 'http/httpErrorHandler';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({
    summary: 'User Signup',
    description: 'Endpoint to create a new user account.',
  })
  @ApiResponse({
    status: 201,
    description: 'Returns a token upon successful signup.',
  })
  async signup(
    @Res() res: Response,
    @Body(new ValidationPipe()) body: SingupDTO,
  ) {
    try {
      const data = body;
      const token = await this.authService.signup(data);
      return OK(res, 'Signup Success', { token }, HttpStatus.CREATED);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  @Post('login')
  @ApiOperation({
    summary: 'User Login',
    description: 'Endpoint to authenticate and log in a user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a token upon successful login.',
  })
  async login(
    @Res() res: Response,
    @Body(new ValidationPipe()) body: LoginDTO,
  ) {
    try {
      const data = body;
      const token = await this.authService.login(data);
      return OK(res, 'Login Success', { token }, HttpStatus.OK);
    } catch (error) {
      return errorHandler(error, res);
    }
  }
}
