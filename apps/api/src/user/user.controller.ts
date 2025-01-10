import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  HttpStatus,
  Res,
  UseGuards,
  Req,
  Put,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import OK from 'response/Ok';
import { UpdateEmailEntryDto, UpdateUserDTO } from './dto/user.dto';
import errorHandler from 'http/httpErrorHandler';
import { AuthGuard } from '../auth/auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('all')
  @ApiOperation({
    summary: 'Get all users',
    description: 'Endpoint to retrieve all users.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of users.',
  })
  async findAll(@Res() res: Response) {
    try {
      const data = await this.userService.findAll();
      return OK(res, 'Success', data, HttpStatus.OK);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  @Get('')
  @ApiOperation({
    summary: 'Get a user',
    description: 'Endpoint to retrieve a user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the user.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async findOne(@Res() res: Response, @Req() req) {
    try {
      const id = req.user;
      const data = await this.userService.findOne(id);
      return OK(res, 'Success', data, HttpStatus.OK);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  @Patch('')
  @ApiOperation({
    summary: 'Update a user',
    description: 'Endpoint to update a user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated user.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async update(@Res() res: Response, @Req() req, @Body() body: UpdateUserDTO) {
    try {
      const id = req.user;
      const data = await this.userService.update(id, body);
      return OK(res, 'Success', data, HttpStatus.OK);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  @Delete('')
  @ApiOperation({
    summary: 'Delete a user',
    description: 'Endpoint to delete a user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the deleted user.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async remove(@Res() res: Response, @Req() req) {
    try {
      const id = req.user;
      const data = await this.userService.remove(id);
      return OK(res, 'Success', data, HttpStatus.OK);
    } catch (error) {
      return errorHandler(error, res);
    }
  }

  @Put('/emailList/:emailEntryId')
  @ApiOperation({
    summary: 'Update a email list',
    description: 'Endpoint to update email list.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated list.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async updateEmailEntry(
    @Res() res: Response,
    @Req() req,
    @Param('emailEntryId') emailEntryId: string,
    @Body() updateData: UpdateEmailEntryDto,
  ) {
    try {
      const {_id} = req.user;
      const data = await this.userService.updateEmailEntry(_id, emailEntryId, updateData);
      return OK(res, 'Success', data, HttpStatus.OK)
    }
    catch (error) {
      return errorHandler(error, res);
    }
  }



  @Delete('/emailList/:emailEntryId')
  @ApiOperation({
    summary: 'Delete an email from email list',
    description: 'Endpoint to delete an email from email list.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated list.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async deleteEmailEntry(
    @Res() res: Response,
    @Req() req,
    @Param('emailEntryId') emailEntryId: string,
  ) {
    try {
      const {_id} = req.user;
      const updatedUser = await this.userService.deleteEmailEntry(_id, emailEntryId);
      return OK(res, 'Success', updatedUser, HttpStatus.OK)
    } catch (error) {
      return errorHandler(error, res);
    }

  }
}
