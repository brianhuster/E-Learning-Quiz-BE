import { Injectable } from '@nestjs/common';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CourseEntity } from 'src/database/schema/courses/course.schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(CourseEntity.name)
    private courseModel: Model<CourseEntity>,
  ) {}
  // async create(createCourseDto: CourseEntity): Promise<void> {
  //   return;
  //   await this.courseModel.create(createCourseDto);
  // }

  findAll(): Promise<CourseEntity[]> {
    return this.courseModel.find().lean();
  }

  findOne(id: string): Promise<CourseEntity> {
    return this.courseModel.findById(id).lean();
  }

  // update(id: string, updateCourseDto: UpdateCourseDto): Promise<CourseEntity> {
  //   return this.courseModel.findOneAndUpdate(
  //     { _id: new mongoose.SchemaTypes.ObjectId(id) },
  //     { $set: updateCourseDto },
  //     { new: true, lean: true },
  //   );
  // }

  remove(id: string) {
    return `This action removes a #${id} course`;
  }
}
