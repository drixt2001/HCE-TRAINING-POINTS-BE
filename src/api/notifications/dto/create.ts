import { IsNotEmpty } from "class-validator";

export class CreateNoti {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  period_id: number;
}
