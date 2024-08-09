import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ROLE } from 'src/config/constants';
import { Roles } from 'decorators/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import mongoose from 'mongoose';

@UseGuards(AuthGuard, RolesGuard)
@Roles(ROLE.ADMIN)
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  create(@Body() createQuestionDto: CreateQuestionDto): Promise<string> {
    return this.questionsService.create(createQuestionDto);
  }

  @Get()
  findAll(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('id') id?: string,
    @Query('figure', new ParseIntPipe({ optional: true })) figure?: number,
    @Query('chapter', new ParseIntPipe({ optional: true })) chapter?: number,
  ) {
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid id');
    }
    const query = {
      _id: id,
      figure,
      chapter,
    };
    //filter undefined values
    Object.keys(query).forEach(
      (key) => query[key] === undefined && delete query[key],
    );
    return this.questionsService.findAll(+limit || 20, +page || 0, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionsService.update(id, updateQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionsService.remove(id);
  }
}
