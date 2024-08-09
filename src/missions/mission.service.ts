import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  MissionDocument,
  MissionEntity,
} from 'src/database/schema/missions/missions.schema';
import mongoose, { Model } from 'mongoose';
import {
  MAX_HOUSE_PER_DAY,
  STUDY_PATH,
  STUDY_REVIEW_RATIO,
  TIME_UNIT,
} from 'src/config/constants';
import {
  STUDY_STATUS,
  StudyPathEntity,
} from 'src/database/schema/study-path/study-path.schema';

@Injectable()
export class MissionService {
  constructor(
    @InjectModel(MissionEntity.name)
    private readonly missionModel: Model<MissionEntity>,
  ) {}
  create(userId: string, createMissionDto: CreateMissionDto[]) {
    return this.missionModel.insertMany(createMissionDto);
  }

  async createForInitStudyPath(
    userId: string,
    userStudyPath: StudyPathEntity,
    courseInfo: { id: string; elementName: Record<string, string> },
  ) {
    const { content, remainDays } = userStudyPath;
    const mustStudy = content.filter(
      ({ status }) => status !== STUDY_STATUS.COMPLETED,
    );
    const requiredTime =
      mustStudy.reduce(
        (acc, cur) => acc + STUDY_PATH[cur.element].time ?? 0,
        0,
      ) / STUDY_REVIEW_RATIO;
    if (requiredTime > remainDays * MAX_HOUSE_PER_DAY)
      throw new BadRequestException('Not enough time to study');
    const hourStudyPerDay = requiredTime / remainDays;
    const remainStudyTimeEachDays = Array.from(
      { length: remainDays },
      () => hourStudyPerDay,
    );
    const missions: string[][] = [[]];
    let dayIndex = 0;
    for (const studyPath of mustStudy) {
      if (remainStudyTimeEachDays[dayIndex] <= 0) {
        missions.push([]);
        dayIndex++;
      }
      const { element } = studyPath;
      missions.at(-1).push(element);
      const studyTime = STUDY_PATH[element].time ?? 0;
      remainStudyTimeEachDays[dayIndex] -= studyTime;
    }
    const studyIntervals = remainDays / missions.length;
    const today = new Date();
    const listMissionEntity: CreateMissionDto[] = [];
    missions.forEach((mission, index) => {
      mission.forEach((element) => {
        listMissionEntity.push({
          user: userId,
          course: courseInfo.id,
          id: element,
          isComplete: false,
          title: courseInfo.elementName[element],
          dueDate: new Date(
            today.getTime() + studyIntervals * index * TIME_UNIT.DAY,
          ),
        });
      });
    });
    await this.missionModel.insertMany(listMissionEntity);
  }
  deleteAllMissionOfUser(userId: string) {
    return this.missionModel.deleteMany({
      user: new mongoose.Types.ObjectId(userId),
    });
  }

  findAll(userId: string): Promise<MissionDocument[]> {
    return this.missionModel.find({
      user: userId,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} mission`;
  }

  update(id: number, updateMissionDto: UpdateMissionDto) {
    return `This action updates a #${id} mission`;
  }

  remove(id: number) {
    return `This action removes a #${id} mission`;
  }
}
