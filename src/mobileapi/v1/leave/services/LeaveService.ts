import type { Repository } from "typeorm"
import { LeaveType } from "../entities/LeaveType"
import { StaffLeaveApplication } from "../entities/StaffLeaveApplication"
import type { CreateLeaveApplicationDto, UpdateLeaveStatusDto, LeaveFilterDto } from "../dto/CreateLeaveDto"

export class LeaveService {
  private leaveTypeRepository: Repository<LeaveType>
  private leaveApplicationRepository: Repository<StaffLeaveApplication>



  async findAllLeaveTypes(schoolId?: number) {
    const queryBuilder = this.leaveTypeRepository
      .createQueryBuilder("leaveType")
      .where("leaveType.status = :status", { status: "active" })

    if (schoolId) {
      queryBuilder.andWhere("leaveType.school_id = :schoolId", { schoolId })
    }

    return queryBuilder.orderBy("leaveType.name", "ASC").getMany()
  }

  async findAllApplications(filters: LeaveFilterDto = {}) {
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

    return queryBuilder.orderBy("application.applied_on", "DESC").getMany()
  }

  async createApplication(createLeaveDto: CreateLeaveApplicationDto) {
    const application = this.leaveApplicationRepository.create({
      ...createLeaveDto,
      start_date: createLeaveDto.start_date,
      end_date: createLeaveDto.end_date,
    })

    return this.leaveApplicationRepository.save(application)
  }

  async updateApplicationStatus(id: number, updateStatusDto: UpdateLeaveStatusDto) {
    const application = await this.leaveApplicationRepository.findOne({ where: { id } })
    if (!application) {
      throw new Error("Leave application not found")
    }

    application.status = updateStatusDto.status
    if (updateStatusDto.approved_by) {
      application.approved_by = updateStatusDto.approved_by
      application.approved_on = new Date()
    }
    if (updateStatusDto.rejection_reason) {
      application.rejection_reason = updateStatusDto.rejection_reason
    }

    return this.leaveApplicationRepository.save(application)
  }

  async getLeaveAnalysis(schoolId?: number, year = 2024) {
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

    return queryBuilder.getRawMany()
  }
}
