import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  STUDY_STATUS,
  StudyPathDocument,
  StudyPathEntity,
  StudyStatusEntity,
} from 'src/database/schema/study-path/study-path.schema';
import mongoose, { Model } from 'mongoose';
import { CreateStudyPathDto } from './dto/create-study-path.dto';

@Injectable()
export class StudyPathService {
  constructor(
    @InjectModel(StudyPathEntity.name)
    private studyPathEntity: Model<StudyPathEntity>,
  ) {}
  async create(
    userId: string,
    payload: CreateStudyPathDto,
  ): Promise<StudyPathDocument> {
    const { studyPath, courseId, ...restData } = payload;
    const content: StudyStatusEntity[] = studyPath.map((node) => ({
      element: node,
      status: STUDY_STATUS.LOCKED,
    }));
    return this.studyPathEntity.create({
      content,
      user: new mongoose.Types.ObjectId(userId),
      course: new mongoose.Types.ObjectId(courseId),
      ...restData,
    });
  }

  findOne() {
    return `This action returns all studyPath`;
  }

  findAll(userId: string, courseId: string): Promise<StudyPathDocument> {
    return this.studyPathEntity
      .find({
        user: new mongoose.Types.ObjectId(userId),
        course: new mongoose.Types.ObjectId(courseId),
      })
      .lean();
  }

  async update(userId: string, courseId: string, index: number): Promise<void> {
    await this.studyPathEntity.updateMany(
      {
        user: new mongoose.Types.ObjectId(userId),
        course: new mongoose.Types.ObjectId(courseId),
      },
      {
        $set: {
          [`content.${index}.status`]: STUDY_STATUS.UNLOCKED,
        },
      },
    );
  }
}
