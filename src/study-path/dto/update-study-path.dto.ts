import { PartialType } from '@nestjs/swagger';
import { CreateStudyPathDto } from './create-study-path.dto';

export class UpdateStudyPathDto extends PartialType(CreateStudyPathDto) {}
