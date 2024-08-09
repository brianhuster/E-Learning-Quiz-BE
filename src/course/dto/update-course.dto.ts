import { CreateCourseDto } from './create-course.dto';

export interface UpdateCourseDto extends Partial<CreateCourseDto> {}
