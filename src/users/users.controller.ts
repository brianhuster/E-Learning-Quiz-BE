import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get()
  findAllUser(
    @Query('term') term?: string,
    @Query('role') role?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
  ) {
    const query = {
      term,
      role,
    };
    Object.keys(query).forEach(
      (key) => query[key] === undefined && delete query[key],
    );
    return this.userService.findAll(limit, page, query);
  }
  @Patch(':id')
  editUser(@Param('id') id: string, @Body() payload: any) {
    return this.userService.editUser(id, payload);
  }
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
