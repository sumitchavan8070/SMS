import { Injectable, NotFoundException, InternalServerErrorException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { LeaveType } from "./entities/leave-type.entity"
import { StaffLeaveApplication } from "./entities/staff-leave-application.entity"
import { CreateLeaveApplicationDto } from "./dto/create-leave-application.dto"
import { UpdateLeaveStatusDto } from "./dto/update-leave-status.dto"
import { LeaveFilterDto } from "./dto/leave-filter.dto"

@Injectable()
export class LeaveService {
  constructor(
    @InjectRepository(LeaveType)
    private readonly leaveTypeRepository: Repository<LeaveType>,

    @InjectRepository(StaffLeaveApplication)
    private readonly leaveApplicationRepository: Repository<StaffLeaveApplication>,
  ) {}

  async findAllLeaveTypes(schoolId?: number) {
    try {
      const queryBuilder = this.leaveTypeRepository
        .createQueryBuilder("leaveType")
        .where("leaveType.status = :status", { status: "active" })

      if (schoolId) {
        queryBuilder.andWhere("leaveType.school_id = :schoolId", { schoolId })
      }

      const leaveTypes = await queryBuilder.orderBy("leaveType.name", "ASC").getMany()

      return {
        status: 1,
        message: "Leave types retrieved successfully",
        data: leaveTypes,
      }
    } catch (error) {
      console.error("Error fetching leave types:", error)
      throw new InternalServerErrorException("Failed to fetch leave types")
    }
  }

  async findAllApplications(filters: LeaveFilterDto = {}) {
    try {
      const queryBuilder = this.leaveApplicationRepository
        .createQueryBuilder("application")
        .leftJoinAndSelect("application.leaveType", "leaveType")
        .leftJoinAndSelect("application.staff", "staff")
        .leftJoinAndSelect("staff.user", "user")
        .leftJoinAndSelect("user.profile", "profile")
        .leftJoinAndSelect("application.approver", "approver")
        .leftJoinAndSelect("approver.user", "approverUser")
        .leftJoinAndSelect("approverUser.profile", "approverProfile")

      if (filters.schoolId) {
        queryBuilder.andWhere("application.school_id = :schoolId", { schoolId: filters.schoolId })
      }

      if (filters.staffId) {
        queryBuilder.andWhere("application.staff_id = :staffId", { staffId: filters.staffId })
      }

      if (filters.status) {
        queryBuilder.andWhere("application.status = :status", { status: filters.status })
      }

      if (filters.year) {
        queryBuilder.andWhere("YEAR(application.start_date) = :year", { year: filters.year })
      }

      const applications = await queryBuilder.orderBy("application.applied_on", "DESC").getMany()

      return {
        status: 1,
        message: "Leave applications retrieved successfully",
        data: applications,
      }
    } catch (error) {
      console.error("Error fetching leave applications:", error)
      throw new InternalServerErrorException("Failed to fetch leave applications")
    }
  }

  async createApplication(createLeaveDto: CreateLeaveApplicationDto) {
    try {
      const application = this.leaveApplicationRepository.create({
        ...createLeaveDto,
        start_date: new Date(createLeaveDto.start_date),
        end_date: new Date(createLeaveDto.end_date),
      })

      const savedApplication = await this.leaveApplicationRepository.save(application)

      return {
        status: 1,
        message: "Leave application created successfully",
        data: savedApplication,
      }
    } catch (error) {
      console.error("Error creating leave application:", error)
      throw new InternalServerErrorException("Failed to create leave application")
    }
  }

  async updateApplicationStatus(id: number, updateStatusDto: UpdateLeaveStatusDto) {
    try {
      const application = await this.leaveApplicationRepository.findOne({ where: { id } })
      if (!application) {
        throw new NotFoundException("Leave application not found")
      }

      application.status = updateStatusDto.status
      if (updateStatusDto.approved_by) {
        application.approved_by = updateStatusDto.approved_by
        application.approved_on = new Date()
      }
      if (updateStatusDto.rejection_reason) {
        application.rejection_reason = updateStatusDto.rejection_reason
      }

      const updatedApplication = await this.leaveApplicationRepository.save(application)

      return {
        status: 1,
        message: "Leave application status updated successfully",
        data: updatedApplication,
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      console.error("Error updating leave application:", error)
      throw new InternalServerErrorException("Failed to update leave application")
    }
  }

  async getLeaveAnalysis(schoolId?: number, year = 2024) {
    try {
      const queryBuilder = this.leaveApplicationRepository
        .createQueryBuilder("application")
        .leftJoin("application.staff", "staff")
        .leftJoin("staff.school", "school")
        .leftJoin("application.leaveType", "leaveType")
        .select([
          "school.name as school_name",
          "staff.department as department",
          "leaveType.name as leave_type",
          "COUNT(application.id) as total_applications",
          "SUM(CASE WHEN application.status = 'approved' THEN application.total_days ELSE 0 END) as approved_days",
          "SUM(CASE WHEN application.status = 'pending' THEN application.total_days ELSE 0 END) as pending_days",
          "AVG(CASE WHEN application.status = 'approved' THEN application.total_days END) as avg_leave_duration",
        ])
        .where("YEAR(application.start_date) = :year", { year })
        .groupBy("school.id, staff.department, leaveType.id")
        .orderBy("school.name", "ASC")
        .addOrderBy("staff.department", "ASC")
        .addOrderBy("total_applications", "DESC")

      if (schoolId) {
        queryBuilder.andWhere("school.id = :schoolId", { schoolId })
      }

      const result = await queryBuilder.getRawMany()

      return {
        status: 1,
        message: "Leave analysis retrieved successfully",
        data: result,
      }
    } catch (error) {
      console.error("Error fetching leave analysis:", error)
      throw new InternalServerErrorException("Failed to fetch leave analysis")
    }
  }
}
