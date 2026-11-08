import { IsDateString, IsNotEmpty, IsString, Matches } from "class-validator";

export class UpdateRecordDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}