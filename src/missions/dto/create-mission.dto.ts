export class CreateMissionDto {
  id: string;
  user: string;
  course: string;
  title: string;
  content?: string;
  isComplete: boolean;
  dueDate: Date;
}
