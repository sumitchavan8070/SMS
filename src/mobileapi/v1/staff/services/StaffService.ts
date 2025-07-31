// import type { Repository } from "typeorm"
// import { Staff } from "../entities/Staff"
// import { User } from "../../user/entities/User"
// import { UserProfile } from "../../user/entities/UserProfile"
// import type { CreateStaffDto, UpdateStaffDto, StaffFilterDto } from "../dto/CreateStaffDto"

// export class StaffService {
//   private staffRepository: Repository<Staff>

//   async findAll(filters: StaffFilterDto = {}) {
//     const queryBuilder = this.staffRepository
//       .createQueryBuilder("staff")
//       .leftJoinAndSelect("staff.user", "user")
//       .leftJoinAndSelect("user.profile", "profile")
//       .leftJoinAndSelect("staff.school", "school")
//       .leftJoinAndSelect("staff.reportingManager", "manager")
//       .leftJoinAndSelect("manager.user", "managerUser")
//       .leftJoinAndSelect("managerUser.profile", "managerProfile")

//     if (filters.schoolId) {
//       queryBuilder.andWhere("staff.school_id = :schoolId", { schoolId: filters.schoolId })
//     }

//     if (filters.department) {
//       queryBuilder.andWhere("staff.department = :department", { department: filters.department })
//     }

//     if (filters.status) {
//       queryBuilder.andWhere("staff.status = :status", { status: filters.status })
//     }

//     if (filters.designation) {
//       queryBuilder.andWhere("staff.designation LIKE :designation", { designation: `%${filters.designation}%` })
//     }

//     if (filters.withSummary) {
//       queryBuilder
//         .leftJoinAndSelect("staff.performanceEvaluations", "evaluations", "evaluations.status = :evalStatus", {
//           evalStatus: "finalized",
//         })
//         .leftJoinAndSelect(
//           "staff.leaveApplications",
//           "leaves",
//           "leaves.status = :leaveStatus AND YEAR(leaves.start_date) = :year",
//           {
//             leaveStatus: "approved",
//             year: new Date().getFullYear(),
//           },
//         )
//         .leftJoinAndSelect("staff.salaries", "salaries", "salaries.month = :month AND salaries.year = :salYear", {
//           month: "July",
//           salYear: 2024,
//         })
//     }

//     return queryBuilder
//       .orderBy("school.name", "ASC")
//       .addOrderBy("staff.department", "ASC")
//       .addOrderBy("staff.designation", "ASC")
//       .getMany()
//   }

//   async findById(id: number) {
//     return this.staffRepository
//       .createQueryBuilder("staff")
//       .leftJoinAndSelect("staff.user", "user")
//       .leftJoinAndSelect("user.profile", "profile")
//       .leftJoinAndSelect("staff.school", "school")
//       .leftJoinAndSelect("staff.reportingManager", "manager")
//       .leftJoinAndSelect("manager.user", "managerUser")
//       .leftJoinAndSelect("managerUser.profile", "managerProfile")
//       .leftJoinAndSelect("staff.qualifications", "qualifications")
//       .where("staff.id = :id", { id })
//       .getOne()
//   }

//   // async create(createStaffDto: CreateStaffDto) {
//   //   const queryRunner = AppDataSource.createQueryRunner()
//   //   await queryRunner.connect()
//   //   await queryRunner.startTransaction()

//   //   try {
//   //     // Create user
//   //     const user = this.userRepository.create({
//   //       username: createStaffDto.username,
//   //       email: createStaffDto.email,
//   //       password: createStaffDto.password,
//   //       role_id: createStaffDto.role_id,
//   //       school_id: createStaffDto.school_id,
//   //     })
//   //     const savedUser = await queryRunner.manager.save(user)

//   //     // Create user profile
//   //     const userProfile = this.userProfileRepository.create({
//   //       user_id: savedUser.id,
//   //       full_name: createStaffDto.full_name,
//   //       gender: createStaffDto.gender as any,
//   //       dob: createStaffDto.dob,
//   //       address: createStaffDto.address,
//   //       phone: createStaffDto.phone,
//   //     })
//   //     await queryRunner.manager.save(userProfile)

//   //     // Create staff
//   //     const staff = this.staffRepository.create({
//   //       employee_id: createStaffDto.employee_id,
//   //       user_id: savedUser.id,
//   //       school_id: createStaffDto.school_id,
//   //       department: createStaffDto.department,
//   //       designation: createStaffDto.designation,
//   //       joining_date: createStaffDto.joining_date,
//   //       salary_grade: createStaffDto.salary_grade,
//   //       qualification: createStaffDto.qualification,
//   //       experience_years: createStaffDto.experience_years,
//   //       reporting_manager_id: createStaffDto.reporting_manager_id,
//   //       emergency_contact: createStaffDto.emergency_contact,
//   //       blood_group: createStaffDto.blood_group,
//   //     })
//   //     const savedStaff = await queryRunner.manager.save(staff)

//   //     await queryRunner.commitTransaction()
//   //     return savedStaff
//   //   } catch (error) {
//   //     await queryRunner.rollbackTransaction()
//   //     throw error
//   //   } finally {
//   //     await queryRunner.release()
//   //   }
//   // }

//   async update(id: number, updateStaffDto: UpdateStaffDto) {
//     const staff = await this.staffRepository.findOne({ where: { id } })
//     if (!staff) {
//       throw new Error("Staff member not found")
//     }

//     Object.assign(staff, updateStaffDto)
//     return this.staffRepository.save(staff)
//   }

//   async delete(id: number) {
//     const staff = await this.staffRepository.findOne({ where: { id } })
//     if (!staff) {
//       throw new Error("Staff member not found")
//     }

//     staff.status = "terminated" as any
//     return this.staffRepository.save(staff)
//   }

//   async getDepartmentWiseCount(schoolId?: number) {
//     const queryBuilder = this.staffRepository
//       .createQueryBuilder("staff")
//       .leftJoin("staff.school", "school")
//       .select([
//         "school.name as school_name",
//         "staff.department as department",
//         "COUNT(*) as staff_count",
//         "AVG(staff.experience_years) as avg_experience",
//       ])
//       .where("staff.status = :status", { status: "active" })
//       .groupBy("school.id, staff.department")
//       .orderBy("school.name", "ASC")
//       .addOrderBy("staff.department", "ASC")

//     if (schoolId) {
//       queryBuilder.andWhere("school.id = :schoolId", { schoolId })
//     }

//     return queryBuilder.getRawMany()
//   }

//   async getStaffHierarchy(schoolId?: number) {
//     const queryBuilder = this.staffRepository
//       .createQueryBuilder("emp")
//       .leftJoin("emp.school", "school")
//       .leftJoin("emp.user", "empUser")
//       .leftJoin("empUser.profile", "empProfile")
//       .leftJoin("emp.reportingManager", "mgr")
//       .leftJoin("mgr.user", "mgrUser")
//       .leftJoin("mgrUser.profile", "mgrProfile")
//       .select([
//         "school.name as school_name",
//         "emp.employee_id as employee_id",
//         "empProfile.full_name as employee_name",
//         "emp.designation as employee_designation",
//         "mgr.employee_id as manager_id",
//         "mgrProfile.full_name as manager_name",
//         "mgr.designation as manager_designation",
//       ])
//       .orderBy("school.name", "ASC")
//       .addOrderBy("mgr.employee_id", "ASC")
//       .addOrderBy("emp.employee_id", "ASC")

//     if (schoolId) {
//       queryBuilder.where("school.id = :schoolId", { schoolId })
//     }

//     return queryBuilder.getRawMany()
//   }
// }
