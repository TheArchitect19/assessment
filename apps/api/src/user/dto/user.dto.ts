import { IsEmail, IsArray, ValidateNested, IsInt, Min, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class EmailEntryDTO {
  @ApiProperty({
    description: 'Email address in the email list',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Number of times this email can be used',
    type: Number,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  count: number;
}

export class UpdateUserDTO {
  @ApiProperty({
    description: 'Primary email of the user',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Number of times this email can be used',
    type: Number,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  count: number;
  
  @ApiProperty({ description: 'Name of the person' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Position of the person' })
  @IsString()
  @IsNotEmpty()
  position: string;

  @ApiProperty({ description: 'Signature of the person' })
  @IsString()
  @IsNotEmpty()
  signature: string;
}

export class UpdateEmailEntryDto {
  email?: string;
  count?: number;
  name?: string;
  position?: string;
  signature?: string;
}
