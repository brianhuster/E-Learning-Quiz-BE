import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MissionService } from './mission.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequestWithUser } from 'src/types/types';

@UseGuards(AuthGuard)
@Controller('mission')
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @Post()
  create(
    @Body() { missions }: { missions: CreateMissionDto[] },
    @Req() req: RequestWithUser,
  ) {
    return this.missionService.create(req.user.id, missions);
  }

  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.missionService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.missionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMissionDto: UpdateMissionDto) {
    return this.missionService.update(+id, updateMissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.missionService.remove(+id);
  }
}
