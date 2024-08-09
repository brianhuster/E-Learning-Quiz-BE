import { Injectable } from '@nestjs/common';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectModel } from '@nestjs/mongoose';
import { QuizQuestionEntity } from 'src/database/schema/quiz-questions/quiz-question.schema';
import { Model } from 'mongoose';
import { CreateQuestionDto } from './dto/create-question.dto';
import { GetQuestionFilterRequest } from './dto/get-question.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(QuizQuestionEntity.name)
    private readonly quizQuestionModel: Model<QuizQuestionEntity>,
  ) {}
  async create(createQuestionDto: CreateQuestionDto) {
    const data = await this.quizQuestionModel.insertMany([createQuestionDto]);
    return data.at(0)._id.toString();
  }
  async findAll(limit = 20, page = 0, filter: GetQuestionFilterRequest = {}) {
    const questions = await this.quizQuestionModel
      .find(filter)
      .limit(limit)
      .skip(limit * page);
    const total = await this.quizQuestionModel.countDocuments(filter);
    return {
      questions,
      total,
    };
  }

  async findOne(id: string) {
    return await this.quizQuestionModel.findById(id);
  }

  update(id: string, updateQuestionDto: UpdateQuestionDto) {
    return this.quizQuestionModel.findByIdAndUpdate(
      id,
      {
        $set: updateQuestionDto,
      },
      {
        new: true,
      },
    );
  }

  remove(id: string) {
    return this.quizQuestionModel.findByIdAndDelete(id);
  }
}
