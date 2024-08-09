import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseEntity } from 'src/database/schema/courses/course.schema';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('course')
@UseGuards(AuthGuard)
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  // @ApiOperation({ summary: 'Create a new course' })
  // @Post()
  // create(@Body() courses: CourseEntity): Promise<void> {
  //   return this.courseService.create(courses);
  // }

  @ApiOperation({ summary: 'Get all courses' })
  @Get()
  findAll(): Promise<CourseEntity[]> {
    return this.courseService.findAll();
  }

  @ApiOperation({ summary: 'Get a course by id' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<CourseEntity> {
    return this.courseService.findOne(id);
  }

  // @ApiOperation({ summary: 'Update a course by id' })
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
  //   return this.courseService.update(id, updateCourseDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }
}
