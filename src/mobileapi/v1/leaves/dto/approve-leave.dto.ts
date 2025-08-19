import { IsNotEmpty, IsString, IsOptional } from "class-validator"

export class ApproveLeaveDto {
  @IsString()
  @IsNotEmpty()
  status: string

  @IsString()
  @IsOptional()
  rejectionReason?: string
}
