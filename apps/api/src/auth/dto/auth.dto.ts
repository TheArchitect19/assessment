import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SingupDTO {
  @ApiProperty({
    description: 'UserName',
    format: 'name',
    example: 'ayan',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Email of the user',
    format: 'email',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    format: 'password',
    example: 'StrongPassword123',
  })
  @IsString()
  password: string;

  @IsString()
  signature: string;

  @IsString()
  position: string;
}

export class LoginDTO {
  @ApiProperty({
    description: 'Email of the user',
    format: 'email',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    format: 'password',
    example: 'StrongPassword123',
  })
  @IsString()
  password: string;
}
