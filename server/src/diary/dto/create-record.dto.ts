import { IsDateString, IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateRecordDto {
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  targetDate: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}