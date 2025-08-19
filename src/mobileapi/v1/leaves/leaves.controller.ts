import { Controller, Get, Post, Put, Body, Query, Param, BadRequestException } from "@nestjs/common";
import { LeavesService } from "./leaves.service";
import { CreateLeaveApplicationDto } from "./dto/create-leave-application.dto";
import { ApproveLeaveDto } from "./dto/approve-leave.dto";

@Controller("v1/leaves")
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

  /** GET ALL LEAVE TYPES */
  @Get("types")
  async getLeaveTypes(@Query('userId') userId: number) {
    if (!userId) throw new BadRequestException("userId is required");
    return this.leavesService.getLeaveTypesByUserId(Number(userId));
  }

  /** GET PENDING STAFF LEAVES */
  @Get("staff/pending")
  async getPendingStaffLeaves(@Query('userId') userId: number) {
    if (!userId) throw new BadRequestException("userId is required");
    return this.leavesService.getPendingStaffLeavesByUserId(Number(userId));
  }

  /** APPLY STAFF LEAVE */
  @Post("staff/apply")
  async applyStaffLeave(
    @Body('userId') userId: number,
    @Body() dto: CreateLeaveApplicationDto
  ) {
    if (!userId) throw new BadRequestException("userId is required");
    return this.leavesService.applyStaffLeaveByUserId(Number(userId), dto);
  }

  /** APPROVE STAFF LEAVE */
  @Post("staff/:leaveId/approve")
  async approveStaffLeave(
    @Body('userId') userId: number,
    @Param('leaveId') leaveId: number,
    @Body() dto: ApproveLeaveDto
  ) {
    if (!userId) throw new BadRequestException("userId is required");
    if (!dto.status) throw new BadRequestException("status is required");

    return this.leavesService.approveStaffLeaveByUserId(Number(userId), leaveId, dto);
  }

  /** GET STAFF LEAVE HISTORY */
  @Get("staff/history")
  async getStaffLeaveHistory(
    @Query('userId') userId: number,
    @Query('staffId') staffId?: number
  ) {
    if (!userId) throw new BadRequestException("userId is required");
    return this.leavesService.getStaffLeaveHistoryByUserId(Number(userId), staffId ? Number(staffId) : undefined);
  }
}
