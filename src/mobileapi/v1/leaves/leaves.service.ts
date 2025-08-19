import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import type { DeepPartial, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { StaffLeaveApplications } from "../entities/staffleaveapplications.entity";
import { Users } from "../entities/users.entity";
import { LeaveTypes } from "../entities/leavetypes.entity";

import { CreateLeaveApplicationDto } from "./dto/create-leave-application.dto";
import { ApproveLeaveDto } from "./dto/approve-leave.dto";

export enum LeaveStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
}

@Injectable()
export class LeavesService {
  constructor(
    @InjectRepository(LeaveTypes)
    private leaveTypeRepository: Repository<LeaveTypes>,

    @InjectRepository(StaffLeaveApplications)
    private staffLeaveRepository: Repository<StaffLeaveApplications>,

    @InjectRepository(Users)
    private userRepository: Repository<Users>
  ) {}

  /** Helper: fetch user by userId */
  private async getUser(userId: number): Promise<Users> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  /** GET ALL LEAVE TYPES FOR SCHOOL */
  async getLeaveTypes(schoolId: number) {
    const leaveTypes = await this.leaveTypeRepository.find({
      where: { schoolId },
      order: { name: "ASC" },
    });

    return {
      status: 1,
      message: "Leave types retrieved successfully",
      data: leaveTypes,
    };
  }

  async getLeaveTypesByUserId(userId: number) {
    const user = await this.getUser(userId);
    return this.getLeaveTypes(user.schoolId);
  }

  /** GET PENDING STAFF LEAVES */
  async getPendingStaffLeaves(schoolId: number) {
    const pendingLeaves = await this.staffLeaveRepository.find({
      where: { status: LeaveStatus.PENDING },
      relations: ["staff", "leaveType", "approvedBy2"],
      order: { appliedOn: "DESC" },
    });

    const filtered = pendingLeaves.filter((leave) => leave.staff.schoolId === schoolId);

    return {
      status: 1,
      message: "Pending staff leaves retrieved successfully",
      data: filtered.map((leave) => ({
        id: leave.id,
        staffName: leave.staff.userId,
        department: leave.staff.department,
        leaveType: leave.leaveType.name,
        startDate: leave.startDate,
        endDate: leave.endDate,
        totalDays: leave.totalDays,
        reason: leave.reason,
        appliedDate: leave.appliedOn,
        medicalCertificate: leave.medicalCertificatePath,
        approvedBy: leave.approvedBy2?.userId || null,
      })),
    };
  }

  async getPendingStaffLeavesByUserId(userId: number) {
    const user = await this.getUser(userId);
    return this.getPendingStaffLeaves(user.schoolId);
  }

  /** APPLY STAFF LEAVE */
  async applyStaffLeave(user: Users, dto: CreateLeaveApplicationDto) {
    const { leaveTypeId, startDate, endDate, reason, medicalCertificate } = dto;

    const leaveType = await this.leaveTypeRepository.findOne({
      where: { id: leaveTypeId, schoolId: user.schoolId },
    });
    if (!leaveType) throw new NotFoundException("Leave type not found");

    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (totalDays <= 0) throw new BadRequestException("End date must be after start date");

    if ((leaveType as any).requiresMedicalCertificate && !medicalCertificate) {
      throw new BadRequestException("Medical certificate is required for this leave type");
    }

    const payload: DeepPartial<StaffLeaveApplications> = {
      staffId: user.id,
      leaveTypeId,
      schoolId: user.schoolId,
      startDate: start,
      endDate: end,
      totalDays,
      reason,
      medicalCertificatePath: medicalCertificate || null,
      status: LeaveStatus.PENDING,
    };

    const leaveApplication = this.staffLeaveRepository.create(payload);
    await this.staffLeaveRepository.save(leaveApplication);

    return {
      status: 1,
      message: "Leave application submitted successfully",
      data: {
        id: leaveApplication.id,
        staffEmail: user.email,
        leaveType: leaveType.name,
        startDate: leaveApplication.startDate,
        endDate: leaveApplication.endDate,
        totalDays: leaveApplication.totalDays,
        reason: leaveApplication.reason,
        status: leaveApplication.status,
        appliedDate: leaveApplication.appliedOn,
        medicalCertificate: leaveApplication.medicalCertificatePath,
      },
    };
  }

  async applyStaffLeaveByUserId(userId: number, dto: CreateLeaveApplicationDto) {
    const user = await this.getUser(userId);
    return this.applyStaffLeave(user, dto);
  }

  /** APPROVE OR REJECT STAFF LEAVE */
  async approveStaffLeave(user: Users, leaveId: number, dto: ApproveLeaveDto) {
    const { status, rejectionReason } = dto;

    const leave = await this.staffLeaveRepository.findOne({
      where: { id: leaveId },
      relations: ["staff"],
    });
    if (!leave) throw new NotFoundException("Leave application not found");
    if (leave.staff.schoolId !== user.schoolId) {
      throw new NotFoundException("Leave application not in your school");
    }

    leave.status = status as LeaveStatus;
    leave.approvedBy = user.id;
    leave.approvedOn = new Date();
    leave.rejectionReason = status === LeaveStatus.REJECTED ? rejectionReason || null : null;

    await this.staffLeaveRepository.save(leave);

    return {
      status: 1,
      message: `Leave application ${status} successfully`,
      data: {
        id: leave.id,
        staffId: leave.staff.id,
        leaveTypeId: leave.leaveTypeId,
        startDate: leave.startDate,
        endDate: leave.endDate,
        totalDays: leave.totalDays,
        reason: leave.reason,
        status: leave.status,
        approvedBy: leave.approvedBy,
        approvedDate: leave.approvedOn,
        rejectionReason: leave.rejectionReason,
      },
    };
  }

  async approveStaffLeaveByUserId(userId: number, leaveId: number, dto: ApproveLeaveDto) {
    const user = await this.getUser(userId);
    return this.approveStaffLeave(user, leaveId, dto);
  }

  /** GET STAFF LEAVE HISTORY */
  async getStaffLeaveHistory(schoolId: number, staffId: number) {
    const staff = await this.userRepository.findOne({ where: { id: staffId, schoolId } });
    if (!staff) throw new NotFoundException("Staff member not found");

    const leaves = await this.staffLeaveRepository.find({
      where: { staff: { id: staffId } },
      relations: ["leaveType", "approvedBy2"],
      order: { appliedOn: "DESC" },
    });

    return {
      status: 1,
      message: "Staff leave history retrieved successfully",
      data: {
        staff: {
          id: staff.id,
          email: staff.email,
          username: staff.username,
        },
        leaves: leaves.map((leave) => ({
          id: leave.id,
          leaveType: leave.leaveType.name,
          startDate: leave.startDate,
          endDate: leave.endDate,
          totalDays: leave.totalDays,
          reason: leave.reason,
          status: leave.status,
          appliedDate: leave.appliedOn,
          approvedBy: leave.approvedBy2?.userId || null,
          approvedDate: leave.approvedOn,
          rejectionReason: leave.rejectionReason,
        })),
      },
    };
  }

  async getStaffLeaveHistoryByUserId(userId: number, staffId?: number) {
    const user = await this.getUser(userId);
    return this.getStaffLeaveHistory(user.schoolId, staffId || user.id);
  }
}
