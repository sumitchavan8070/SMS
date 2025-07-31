import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, DataSource } from "typeorm"
import * as bcrypt from "bcrypt"

import { Staff } from "./entities/staff.entity"
import { User } from "../auth/entities/user.entity"
import { UserProfile } from "../auth/entities/user-profile.entity"
import { CreateStaffDto } from "./dto/create-staff.dto"
import { UpdateStaffDto } from "./dto/update-staff.dto"
import { StaffFilterDto } from "./dto/staff-filter.dto"

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,

    private readonly dataSource: DataSource,
  ) {}

  async findAll(filters: StaffFilterDto = {}) {
    try {
      const queryBuilder = this.staffRepository
        .createQueryBuilder("staff")
        .leftJoinAndSelect("staff.user", "user")
        .leftJoinAndSelect("user.profile", "profile")
        .leftJoinAndSelect("staff.school", "school")
        .leftJoinAndSelect("staff.reportingManager", "manager")
        .leftJoinAndSelect("manager.user", "managerUser")
        .leftJoinAndSelect("managerUser.profile", "managerProfile")

      if (filters.schoolId) {
        queryBuilder.andWhere("staff.school_id = :schoolId", { schoolId: filters.schoolId })
      }

      if (filters.department) {
        queryBuilder.andWhere("staff.department = :department", { department: filters.department })
      }

      if (filters.status) {
        queryBuilder.andWhere("staff.status = :status", { status: filters.status })
      }

      if (filters.designation) {
        queryBuilder.andWhere("staff.designation LIKE :designation", {
          designation: `%${filters.designation}%`,
        })
      }

      const staff = await queryBuilder
        .orderBy("school.name", "ASC")
        .addOrderBy("staff.department", "ASC")
        .addOrderBy("staff.designation", "ASC")
        .getMany()

      return {
        status: 1,
        message: "Staff retrieved successfully",
        data: staff,
      }
    } catch (error) {
      console.error("Error fetching staff:", error)
      throw new InternalServerErrorException("Failed to fetch staff")
    }
  }

  async findById(id: number) {
    try {
      const staff = await this.staffRepository
        .createQueryBuilder("staff")
        .leftJoinAndSelect("staff.user", "user")
        .leftJoinAndSelect("user.profile", "profile")
        .leftJoinAndSelect("staff.school", "school")
        .leftJoinAndSelect("staff.reportingManager", "manager")
        .leftJoinAndSelect("manager.user", "managerUser")
        .leftJoinAndSelect("managerUser.profile", "managerProfile")
        .leftJoinAndSelect("staff.qualifications", "qualifications")
        .where("staff.id = :id", { id })
        .getOne()

      if (!staff) throw new NotFoundException("Staff member not found")

      return {
        status: 1,
        message: "Staff member retrieved successfully",
        data: staff,
      }
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      console.error("Error fetching staff member:", error)
      throw new InternalServerErrorException("Failed to fetch staff member")
    }
  }

  async create(createStaffDto: CreateStaffDto) {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const hashedPassword = await bcrypt.hash(createStaffDto.password, 10)

      const user = this.userRepository.create({
        username: createStaffDto.username,
        email: createStaffDto.email,
        password: hashedPassword,
        role_id: createStaffDto.role_id,
        school_id: createStaffDto.school_id,
      })
      const savedUser = await queryRunner.manager.save(user)

      const userProfile = this.userProfileRepository.create({
        user_id: savedUser.id,
        full_name: createStaffDto.full_name,
        gender: createStaffDto.gender,
        dob: createStaffDto.dob,
        address: createStaffDto.address,
        phone: createStaffDto.phone,
      })
      await queryRunner.manager.save(userProfile)

      const staff = this.staffRepository.create({
        employee_id: createStaffDto.employee_id,
        user_id: savedUser.id,
        school_id: createStaffDto.school_id,
        department: createStaffDto.department,
        designation: createStaffDto.designation,
        joining_date: createStaffDto.joining_date,
        salary_grade: createStaffDto.salary_grade,
        qualification: createStaffDto.qualification,
        experience_years: createStaffDto.experience_years,
        reporting_manager_id: createStaffDto.reporting_manager_id,
        emergency_contact: createStaffDto.emergency_contact,
        blood_group: createStaffDto.blood_group,
      })
      const savedStaff = await queryRunner.manager.save(staff)

      await queryRunner.commitTransaction()

      return {
        status: 1,
        message: "Staff member created successfully",
        data: { staffId: savedStaff.id, userId: savedUser.id },
      }
    } catch (error) {
      await queryRunner.rollbackTransaction()
      console.error("Error creating staff member:", error)
      throw new InternalServerErrorException("Failed to create staff member")
    } finally {
      await queryRunner.release()
    }
  }

  async update(id: number, updateStaffDto: UpdateStaffDto) {
    try {
      const staff = await this.staffRepository.findOne({ where: { id } })
      if (!staff) throw new NotFoundException("Staff member not found")

      Object.assign(staff, updateStaffDto)
      const updatedStaff = await this.staffRepository.save(staff)

      return {
        status: 1,
        message: "Staff member updated successfully",
        data: updatedStaff,
      }
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      console.error("Error updating staff member:", error)
      throw new InternalServerErrorException("Failed to update staff member")
    }
  }

  async delete(id: number) {
    try {
      const staff = await this.staffRepository.findOne({ where: { id } })
      if (!staff) throw new NotFoundException("Staff member not found")

      staff.status = "terminated" as any
      await this.staffRepository.save(staff)

      return {
        status: 1,
        message: "Staff member deleted successfully",
      }
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      console.error("Error deleting staff member:", error)
      throw new InternalServerErrorException("Failed to delete staff member")
    }
  }

  async getDepartmentWiseCount(schoolId?: number) {
    try {
      const queryBuilder = this.staffRepository
        .createQueryBuilder("staff")
        .leftJoin("staff.school", "school")
        .select([
          "school.name as school_name",
          "staff.department as department",
          "COUNT(*) as staff_count",
          "AVG(staff.experience_years) as avg_experience",
        ])
        .where("staff.status = :status", { status: "active" })
        .groupBy("school.id, staff.department")
        .orderBy("school.name", "ASC")
        .addOrderBy("staff.department", "ASC")

      if (schoolId) {
        queryBuilder.andWhere("school.id = :schoolId", { schoolId })
      }

      const result = await queryBuilder.getRawMany()

      return {
        status: 1,
        message: "Department-wise count retrieved successfully",
        data: result,
      }
    } catch (error) {
      console.error("Error fetching department-wise count:", error)
      throw new InternalServerErrorException("Failed to fetch department-wise count")
    }
  }

  async getStaffHierarchy(schoolId?: number) {
    try {
      const queryBuilder = this.staffRepository
        .createQueryBuilder("emp")
        .leftJoin("emp.school", "school")
        .leftJoin("emp.user", "empUser")
        .leftJoin("empUser.profile", "empProfile")
        .leftJoin("emp.reportingManager", "mgr")
        .leftJoin("mgr.user", "mgrUser")
        .leftJoin("mgrUser.profile", "mgrProfile")
        .select([
          "school.name as school_name",
          "emp.employee_id as employee_id",
          "empProfile.full_name as employee_name",
          "emp.designation as employee_designation",
          "mgr.employee_id as manager_id",
          "mgrProfile.full_name as manager_name",
          "mgr.designation as manager_designation",
        ])
        .orderBy("school.name", "ASC")
        .addOrderBy("mgr.employee_id", "ASC")
        .addOrderBy("emp.employee_id", "ASC")

      if (schoolId) {
        queryBuilder.where("school.id = :schoolId", { schoolId })
      }

      const result = await queryBuilder.getRawMany()

      return {
        status: 1,
        message: "Staff hierarchy retrieved successfully",
        data: result,
      }
    } catch (error) {
      console.error("Error fetching staff hierarchy:", error)
      throw new InternalServerErrorException("Failed to fetch staff hierarchy")
    }
  }

  async getStaffWithSummary(schoolId?: number) {
    try {
      let queryBuilder = this.staffRepository
        .createQueryBuilder("staff")
        .leftJoinAndSelect("staff.user", "user")
        .leftJoinAndSelect("user.profile", "profile")
        .leftJoinAndSelect("staff.school", "school")
        .leftJoinAndSelect("staff.performanceEvaluations", "evaluations", "evaluations.status = :evalStatus", {
          evalStatus: "finalized",
        })
        .leftJoinAndSelect("staff.leaveApplications", "leaves", "leaves.status = :leaveStatus AND YEAR(leaves.start_date) = :year", {
          leaveStatus: "approved",
          year: new Date().getFullYear(),
        })
        .leftJoinAndSelect("staff.salaries", "salaries", "salaries.month = :month AND salaries.year = :salYear", {
          month: "July",
          salYear: 2024,
        })
        .where("staff.status = :status", { status: "active" })

      if (schoolId) {
        queryBuilder = queryBuilder.andWhere("school.id = :schoolId", { schoolId })
      }

      const result = await queryBuilder
        .orderBy("school.name", "ASC")
        .addOrderBy("staff.department", "ASC")
        .addOrderBy("staff.designation", "ASC")
        .getMany()

      return {
        status: 1,
        message: "Staff summary retrieved successfully",
        data: result,
      }
    } catch (error) {
      console.error("Error fetching staff summary:", error)
      throw new InternalServerErrorException("Failed to fetch staff summary")
    }
  }
}
