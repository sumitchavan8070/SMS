import { Injectable } from '@nestjs/common';
import { pool } from '../../../config/db'; // Make sure this path is correct
import { CreateSchoolDto } from './dto/create_school.dto';
import { CreateStaffDto } from './dto/create_staff_dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Classes } from '../entities/classes.entity';
import { Parents } from '../entities/parents.entity';
import { Roles } from '../entities/roles.entity';
import { Staff } from '../entities/staff.entity';
import { Students } from '../entities/students.entity';
import { UserProfiles } from '../entities/userprofiles.entity';
import { Users } from '../entities/users.entity';
import { Subjects } from '../entities/subjects.entity';
import { Schools } from '../entities/schools.entity';
import { Fees } from '../entities/fees.entity';
import { StaffQualifications } from '../entities/staffqualifications.entity';
import { Salaries } from '../entities/salaries.entity';
import { StaffAttendance } from '../entities/staffattendance.entity';
import { StaffLeaveApplications } from '../entities/staffleaveapplications.entity';
import { PerformanceCriteria } from '../entities/performancecriteria.entity';

// [
//   "POST /leaves/apply/:staffId",
//   "PATCH /leaves/update-status/:leaveId",
//   "GET /schools/:schoolId/leave-analytics",
//   "GET /schools/:schoolId/staff-performance-summary",
//   "GET /schools/:schoolId/staff-attendance-performance",
//   "GET /schools/:schoolId/department-budget-utilization",
//   "GET /schools/:schoolId/staff-training-priority",
//   "GET /schools/:schoolId/staff-department-summary"
// ]


@Injectable()
export class ClassService {


  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(UserProfiles) private userProfilesRepository: Repository<UserProfiles>,
    @InjectRepository(Students) private studentsRepository: Repository<Students>,
    @InjectRepository(Parents) private parentsRepository: Repository<Parents>,
    @InjectRepository(Staff) private staffRepository: Repository<Staff>,
    @InjectRepository(Classes) private classesRepository: Repository<Classes>,
    @InjectRepository(Roles) private rolesRepository: Repository<Roles>,
    @InjectRepository(Subjects) private subjectsRepository: Repository<Subjects>,
    @InjectRepository(Schools) private schoolsRepository: Repository<Schools>,
    @InjectRepository(Fees) private feesRepository: Repository<Fees>,
    @InjectRepository(StaffQualifications) private staffQualificationsRepository: Repository<StaffQualifications>,
    @InjectRepository(Salaries) private salariesRepository: Repository<Salaries>,
    @InjectRepository(StaffAttendance) private staffAttendanceRepository: Repository<StaffAttendance>,
    @InjectRepository(StaffLeaveApplications) private leaveApplicationsRepository: Repository<StaffLeaveApplications>,
    @InjectRepository(PerformanceCriteria) private schoolDepartmentRepository: Repository<PerformanceCriteria>,
    
    
    



    private dataSource: DataSource, // 👈 for transaction support

    private readonly jwtService: JwtService,
  ) { }


  async getAllClasses(): Promise<any> {
    try {
      const classes = await this.classesRepository.find();

      return {
        status: 1,
        message: 'Classes fetched successfully',
        classes,
      };
    } catch (error) {
      console.error('Get Classes Error:', error);
      return {
        status: 0,
        message: 'Failed to fetch classes',
        error: error.message,
      };
    }
  }


  async getClassById(class_id: number): Promise<any> {
    try {
      const foundClass = await this.classesRepository.findOneBy({ id: class_id });

      if (!foundClass) {
        return {
          status: 0,
          message: 'Class not found',
        };
      }

      return {
        status: 1,
        message: 'Class fetched successfully',
        class: foundClass,
      };
    } catch (error) {
      console.error('Get Class By ID Error:', error);
      return {
        status: 0,
        message: 'Failed to fetch class',
        error: error.message,
      };
    }
  }


  async createClass(class_name: string): Promise<any> {
    try {
      const newClass = this.classesRepository.create({ name: class_name });
      const savedClass = await this.classesRepository.save(newClass);

      return {
        status: 1,
        message: 'Class created successfully',
        class_id: savedClass.id,
      };
    } catch (error) {
      console.error('Create Class Error:', error);
      return {
        status: 0,
        message: 'Failed to create class',
        error: error.message,
      };
    }
  }



  async getAllSubjects(): Promise<any> {
    try {
      const subjects = await this.subjectsRepository
        .createQueryBuilder('s')
        .leftJoinAndSelect('s.class', 'c')
        .leftJoin('s.teacher', 't') // Join users table
        .leftJoin('user_profiles', 'up', 'up.user_id = t.id') // Join user_profiles manually
        .select([
          's.id',
          's.name',
          's.classId',
          's.teacherId',
          'c.name',
          'up.full_name',
        ])
        .addSelect('c.name', 'class_name')
        .addSelect('up.full_name', 'teacher_name')
        .getRawMany();

      return {
        status: 1,
        message: 'Subjects fetched successfully',
        subjects: subjects.map(row => ({
          id: row.s_id,
          name: row.s_name,
          class_id: row.s_classId,
          teacher_id: row.s_teacherId,
          class_name: row.class_name,
          teacher_name: row.teacher_name,
        })),
      };
    } catch (error) {
      console.error('Get Subjects Error:', error);
      return {
        status: 0,
        message: 'Failed to fetch subjects',
        error: error.message,
      };
    }
  }


  async getSubjectsByClassId(class_id: number): Promise<any> {
    try {
      const subjects = await this.subjectsRepository
        .createQueryBuilder('s')
        .leftJoin('s.teacher', 't') // users table
        .leftJoin('user_profiles', 'up', 'up.user_id = t.id') // user_profiles join
        .where('s.class_id = :class_id', { class_id })
        .select([
          's.id AS id',
          's.name AS name',
          's.class_id AS class_id',
          's.teacher_id AS teacher_id',
          'up.full_name AS teacher_name',
        ])
        .getRawMany();

      if (!subjects.length) {
        return {
          status: 0,
          message: 'No subjects found for this class',
        };
      }

      return {
        status: 1,
        message: 'Subjects fetched successfully',
        subjects,
      };
    } catch (error) {
      console.error('Get Subjects By Class ID Error:', error);
      return {
        status: 0,
        message: 'Failed to fetch subjects',
        error: error.message,
      };
    }
  }



  async getSubjectsByTeacherId(userId: number, roleId: number): Promise<any> {
    if (roleId !== 4) {
      return {
        status: 0,
        message: 'You are not authorized',
      };
    }

    try {
      const subjects = await this.subjectsRepository
        .createQueryBuilder('s')
        .leftJoinAndSelect('s.class', 'c') // Join the Class entity
        .where('s.teacherId = :userId', { userId }) // Use camelCase if your entity uses it
        .select([
          's.id',
          's.name',
          's.classId',
          'c.name',
        ])
        .getMany();

      const response = subjects.map((subject) => ({
        id: subject.id,
        name: subject.name,
        class_id: subject.classId,
        class_name: subject.class?.name ?? null,
      }));

      return {
        status: 1,
        message: 'Subjects fetched successfully',
        data: response,
      };
    } catch (error) {
      console.error('Error fetching subjects by teacher:', error);
      return {
        status: 0,
        message: 'Server error while fetching subjects',
        error: error.message,
      };
    }
  }


  async createSchool(schoolDto: CreateSchoolDto): Promise<any> {
    try {
      const {
        name,
        code,
        address,
        phone,
        email,
        principal_name,
        established_year,
        status = 'active',
      } = schoolDto;

      const newSchool = this.schoolsRepository.create({
        name,
        code,
        address,
        phone,
        email,
        principalName: principal_name,
        establishedYear: established_year,
        status,
      });

      const savedSchool = await this.schoolsRepository.save(newSchool);

      return {
        status: 1,
        message: 'School created successfully',
        schoolId: savedSchool.id,
      };
    } catch (error) {
      console.error('Create School Error:', error);
      return {
        status: 0,
        message: 'Failed to create school',
        error: error.message,
      };
    }
  }


  async getStudentsBySchoolId(school_id: number): Promise<any> {
    if (!school_id) {
      return {
        status: 0,
        message: 'You are not authorized.',
      };
    }

    try {
      const students = await this.studentsRepository
        .createQueryBuilder('st')
        .leftJoinAndSelect('st.school', 's')
        .leftJoinAndSelect('st.class', 'c')
        .leftJoin('st.user', 'u')
        .leftJoinAndSelect('u.profile', 'up')
        .where('s.id = :schoolId', { schoolId: school_id })
        .orderBy('c.name', 'ASC')
        .addOrderBy('st.rollNumber', 'ASC')
        .select([
          's.name',
          'up.fullName',
          'c.name',
          'st.rollNumber',
          'st.admissionDate',
          'up.gender',
          'up.dob',
          'up.phone',
        ])
        .getRawMany();

      return {
        status: 1,
        message: 'Students fetched successfully',
        data: students.map((s) => ({
          school_name: s.s_name,
          student_name: s.up_fullName,
          class_name: s.c_name,
          roll_number: s.st_rollNumber,
          admission_date: s.st_admissionDate,
          gender: s.up_gender,
          dob: s.up_dob,
          phone: s.up_phone,
        })),
      };
    } catch (error) {
      console.error('Error fetching students:', error);
      return {
        status: 0,
        message: 'Failed to fetch students',
        error: error.message,
      };
    }
  }



  async getTeachersBySchoolId(school_id: number): Promise<any> {
    if (!school_id) {
      return {
        status: 0,
        message: 'School ID is required.',
      };
    }

    try {
      const teachers = await this.usersRepository
        .createQueryBuilder('u')
        .leftJoinAndSelect('u.profile', 'up')
        .leftJoinAndSelect('u.school', 's')
        .leftJoinAndSelect('u.role', 'r')
        .where('u.schoolId = :schoolId', { schoolId: school_id })
        .andWhere('r.name = :roleName', { roleName: 'Teacher' })
        .orderBy('up.fullName', 'ASC')
        .select([
          's.name',
          'up.fullName',
          'r.name',
        ])
        .getRawMany();

      return {
        status: 1,
        message: 'Teachers fetched successfully',
        data: teachers.map((t) => ({
          school_name: t.s_name,
          teacher_name: t.up_fullName,
          role: t.r_name,
        })),
      };
    } catch (error) {
      console.error('Error fetching teachers:', error);
      return {
        status: 0,
        message: 'Failed to fetch teachers',
        error: error.message,
      };
    }
  }

  async getFeeSummaryBySchool(): Promise<any> {
    try {
      const results = await this.feesRepository
        .createQueryBuilder('f')
        .innerJoin('f.school', 's')
        .select('s.name', 'school_name')
        .addSelect('f.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .addSelect('SUM(f.amount)', 'total_amount')
        .groupBy('s.id')
        .addGroupBy('f.status')
        .orderBy('s.name')
        .addOrderBy('f.status')
        .getRawMany();

      return {
        status: 1,
        message: 'Fee summary fetched successfully',
        data: results,
      };
    } catch (error) {
      console.error('Error fetching fee summary:', error);
      return {
        status: 0,
        message: 'Failed to fetch fee summary',
        error: error.message,
      };
    }
  }



  async getSubjectTeacherDetailsBySchoolId(school_id: number): Promise<any> {
    try {
      const subjects = await this.subjectsRepository
        .createQueryBuilder('sub')
        .innerJoin('sub.class', 'c')
        .innerJoin('c.school', 's')
        .leftJoin('sub.teacher', 'u')
        .leftJoin('u.profile', 'up') // assuming User -> UserProfile is one-to-one
        .where('s.id = :school_id', { school_id })
        .select([
          's.name AS school_name',
          'c.name AS class_name',
          'sub.name AS subject_name',
          'up.fullName AS teacher_name',
        ])
        .orderBy('s.name')
        .addOrderBy('c.name')
        .addOrderBy('sub.name')
        .getRawMany();

      return {
        status: 1,
        message: 'Subject-teacher details fetched successfully',
        data: subjects,
      };
    } catch (error) {
      console.error('Error fetching subject-teacher details:', error);
      return {
        status: 0,
        message: 'Failed to fetch subject-teacher details',
        error: error.message,
      };
    }
  }



  async createStaff(dto: CreateStaffDto): Promise<any> {
    try {
      const staff = this.staffRepository.create({
        employeeId: dto.employee_id,
        userId: dto.user_id,
        schoolId: dto.school_id,
        department: dto.department,
        designation: dto.designation,
        joiningDate: dto.joining_date,
        salaryGrade: dto.salary_grade || null,
        qualification: dto.qualification || null,
        experienceYears: dto.experience_years || 0,
        status: 'active',
        reportingManagerId: dto.reporting_manager_id || null,
        emergencyContact: dto.emergency_contact || null,
        bloodGroup: dto.blood_group || null,
      });

      const savedStaff = await this.staffRepository.save(staff);

      const qualifications = dto.qualifications.map(q => {
        return this.staffQualificationsRepository.create({
          staffId: savedStaff.id,
          degree: q.degree,
          institution: q.institution,
          yearCompleted: q.year_completed,
          // percentage: q.percentage || 0.0,
          // certificatePath: q.certificate_path || "",
        });
      });

      await this.staffQualificationsRepository.save(qualifications);

      return {
        status: 1,
        message: 'Staff created successfully',
        staff_id: savedStaff.id,
      };
    } catch (error) {
      console.error('Error creating staff:', error);
      return {
        status: 0,
        message: 'Failed to create staff',
        error: error.message,
      };
    }
  }


  async getStaffBySchoolId(school_id: number): Promise<any> {
    if (!school_id) {
      return {
        status: 0,
        message: 'Invalid school ID',
      };
    }

    try {
      const staffList = await this.staffRepository
        .createQueryBuilder('s')
        .innerJoin('s.user', 'u')
        .innerJoin('u.profile', 'up')
        .leftJoin('s.reportingManager', 'mgr')
        .leftJoin('mgr.user', 'mgrUser')
        .leftJoin('mgrUser.profile', 'mgrProfile')
        .leftJoin('s.departmentRelation', 'd') // assume relation to department entity
        .where('s.schoolId = :school_id', { school_id })
        .orderBy('s.id', 'ASC')
        .select([
          's.id',
          's.employeeId',
          's.designation',
          's.department',
          's.joiningDate',
          's.qualification',
          's.experienceYears',
          's.status',
          'up.fullName',
          'up.profilePicture',
          'd.name',
          'mgrProfile.fullName',
        ])
        .getMany();

      const formatted = staffList.map((s) => ({
        staff_id: s.id,
        employee_id: s.employeeId,
        designation: s.designation,
        department: s.department,
        joining_date: s.joiningDate,
        qualification: s.qualification,
        experience_years: s.experienceYears,
        status: s.status,

      }));


      return {
        status: 1,
        message: `Staff list for school ID ${school_id}`,
        total: formatted.length,
        data: formatted,
      };
    } catch (error) {
      console.error('Get Staff Error:', error);
      return {
        status: 0,
        message: 'Failed to fetch staff list',
        error: error.message,
      };
    }
  }


  // staff.service.ts
async getStaffDetailsByUserId(user_id: number): Promise<any> {
  try {
    // Get staff with relations
    const staff = await this.staffRepository.findOne({
      where: { user: { id: user_id } },
      relations: [
        'user',
        'user.profile',
        'school',
        'reportingManager',
        'reportingManager.user',
        'reportingManager.user.profile',
        'qualifications',
      ],
    });

    if (!staff) {
      return {
        status: 0,
        message: 'Staff not found for this user ID',
      };
    }

    return {
      status: 1,
      message: 'Staff details fetched successfully',
      data: {
        staff_id: staff.id,
        user_id: staff.user.id,
        employee_id: staff.employeeId,
        school_id: staff.school?.id,
        school_name: staff.school?.name ?? null,
        designation: staff.designation,
        department: staff.department,
        joining_date: staff.joiningDate,
        qualification: staff.qualification,
        experience_years: staff.experienceYears,
        salary_grade: staff.salaryGrade,
        emergency_contact: staff.emergencyContact,
        blood_group: staff.bloodGroup,

      },
    };
  } catch (error) {
    console.error('Get Staff By User ID Error:', error);
    return {
      status: 0,
      message: 'Failed to fetch staff details',
      error: error.message,
    };
  }
}



async updateStaffByUserId(user_id: number, updateData: Partial<CreateStaffDto>): Promise<any> {
  try {
    if (!user_id || !updateData || Object.keys(updateData).length === 0) {
      return { status: 0, message: 'User ID and update data are required' };
    }

    // First, find the staff by user_id
    const staff = await this.staffRepository.findOne({ where: { user: { id: user_id } } });

    if (!staff) {
      return { status: 0, message: 'Staff record not found for this user ID' };
    }

    // Merge new data
    const updated = this.staffRepository.merge(staff, updateData);

    // Save updated data
    await this.staffRepository.save(updated);

    return {
      status: 1,
      message: 'Staff details updated successfully',
    };
  } catch (error) {
    console.error('Update Staff Error:', error);
    return {
      status: 0,
      message: 'Failed to update staff',
      error: error.message,
    };
  }
}


async getSalaryByUserId(user_id: number): Promise<any> {
  try {
    const salaries = await this.salariesRepository
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.staffTable', 'st') // staffTable is the relation to Staff
      .where('st.user.id = :user_id', { user_id }) // assumes staff has a relation `user`
      .select([
        's.id',
        's.staffId',
        's.month',
        's.year',
        's.baseSalary',
        's.bonus',
        's.deductions',
        's.totalSalary',
        's.schoolId',
        'st.id', // staff_table_id
        'st.user', // optional: to ensure user data is loaded
      ])
      .getMany();

    if (!salaries.length) {
      return {
        status: 0,
        message: 'No salary records found for this user ID',
      };
    }

    return {
      status: 1,
      message: 'Salary records fetched successfully',
      data: salaries.map((s) => ({
        salary_id: s.id,
        staff_id: s.staffId,
        staff_table_id: s.staffTable?.id,
        user_id: s.staffTable?.user?.id,
        month: s.month,
        year: s.year,
        base_salary: s.baseSalary,
        bonus: s.bonus,
        deductions: s.deductions,
        total_salary: s.totalSalary,
        school_id: s.schoolId,
      })),
    };
  } catch (error) {
    console.error('Get Salary By User ID Error:', error);
    return {
      status: 0,
      message: 'Failed to fetch salary details',
      error: error.message,
    };
  }
}



async markStaffAttendanceByUserId(user_id: number, date: string, status: string): Promise<any> {
  try {
    const validStatuses = ['present', 'absent', 'late'];
    if (!validStatuses.includes(status)) {
      return { status: 0, message: 'Invalid attendance status' };
    }

    const staff = await this.staffRepository.findOne({
      where: { user: { id: user_id } },
      relations: ['user'],
    });

    if (!staff) {
      return { status: 0, message: 'Staff not found for the given user ID' };
    }

    const existingAttendance = await this.staffAttendanceRepository.findOne({
      where: {
        staffTable: { id: staff.id },
        date,
      },
    });

    if (existingAttendance) {
      existingAttendance.status = status as any;
      await this.staffAttendanceRepository.save(existingAttendance);
      return { status: 1, message: 'Attendance updated' };
    } else {
      const newAttendance = this.staffAttendanceRepository.create({
        staffTable: staff,
        date,
        status: status as any,
        schoolId: staff.schoolId,
      });

      await this.staffAttendanceRepository.save(newAttendance);
      return { status: 1, message: 'Attendance marked successfully' };
    }
  } catch (error) {
    console.error('Attendance Error:', error);
    return {
      status: 0,
      message: 'Error managing attendance',
      error: error.message,
    };
  }
}





async getLeavesByStaff(staffId: number, status?: string): Promise<any> {
  if (!staffId) {
    return { status: 0, message: 'Staff ID is required.' };
  }

  try {
    const query = this.leaveApplicationsRepository
      .createQueryBuilder('la')
      .leftJoinAndSelect('la.leaveType', 'lt')
      .leftJoinAndSelect('la.staff', 's')
      .leftJoinAndSelect('s.user', 'su')
      .leftJoinAndSelect('su.profile', 'sp')
      .leftJoinAndSelect('la.approvedBy2', 'a') // Approver staff
      .leftJoinAndSelect('a.user', 'au')
      .leftJoinAndSelect('au.profile', 'ap')
      .where('la.staffId = :staffId', { staffId });

    if (status) {
      query.andWhere('la.status = :status', { status });
    }

    const leaves = await query.getMany();

    const formatted = leaves.map(la => ({
      id: la.id,
      leave_type_name: la.leaveType?.name,
      // staff_name: la.staff?.user?.profile?.fullName ?? null,
      // approver_name: la.approvedBy2?.user?.profile?.fullName ?? null,
      start_date: la.startDate,
      end_date: la.endDate,
      total_days: la.totalDays,
      status: la.status,
      applied_on: la.appliedOn,
      approved_on: la.approvedOn,
      rejection_reason: la.rejectionReason,
      emergency_contact: la.emergencyContactDuringLeave,
    }));

    return {
      status: 1,
      message: 'Leave applications fetched successfully.',
      leaves: formatted,
    };
  } catch (error) {
    console.error('💥 Error fetching leave applications:', error);
    return {
      status: 0,
      message: 'Internal server error.',
      error: error.message,
    };
  }
}


  // {
  //   "leave_type_id": 2,
  //   "start_date": "2024-08-10",
  //   "end_date": "2024-08-12",
  //   "total_days": 3,
  //   "reason": "Family medical emergency",
  //   "medical_certificate_path": "/certs/med.pdf",
  //   "emergency_contact_during_leave": "9876543210",
  //   "school_id": 1
  // }


  // {
  //   "leave_type_id": 1,
  //   "from_date": "2024-08-05",
  //   "to_date": "2024-08-08",
  //   "reason": "Medical emergency",
  //   "certificate_url": "https://example.com/medical.pdf",
  //   "school_id": 1
  // }


  // async applyForLeave(staffId: number, dto: CreateLeaveApplicationDto): Promise<any> {
  //   if (!staffId || !dto) {
  //     return { status: 0, message: 'Staff ID and leave details are required.' };
  //   }

  //   let connection;
  //   try {
  //     connection = await pool.getConnection();

  //     const sql = `
  //       INSERT INTO staff_leave_applications 
  //         (staff_id, leave_type_id, from_date, to_date, reason, certificate_url, status, school_id, applied_on) 
  //       VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, NOW())
  //     `;
  //     const params = [
  //       staffId,
  //       dto.leave_type_id,
  //       dto.from_date,
  //       dto.to_date,
  //       dto.reason || '',
  //       dto.certificate_url || '',
  //       dto.school_id
  //     ];

  //     await connection.execute(sql, params);

  //     return {
  //       status: 1,
  //       message: 'Leave application submitted successfully.'
  //     };
  //   } catch (error) {
  //     console.error('💥 Error applying for leave:', error);
  //     return {
  //       status: 0,
  //       message: 'Internal server error.',
  //       error: error.message,
  //     };
  //   } finally {
  //     if (connection) connection.release();
  //   }
  // }


  // {
  //   "status": "approved",
  //   "approved_by": 12,
  //   "remarks": "Approved after verification"
  // }


  // async updateLeaveStatus(leaveId: number, dto: UpdateLeaveStatusDto): Promise<any> {
  //   if (!leaveId || !dto.status || !dto.approved_by) {
  //     return { status: 0, message: 'Leave ID, status, and approver are required.' };
  //   }

  //   let connection;
  //   try {
  //     connection = await pool.getConnection();

  //     const sql = `
  //       UPDATE staff_leave_applications 
  //       SET status = ?, approved_by = ?, remarks = ?, approved_on = NOW() 
  //       WHERE id = ?
  //     `;
  //     const params = [
  //       dto.status,
  //       dto.approved_by,
  //       dto.remarks || '',
  //       leaveId
  //     ];

  //     const [result]: any = await connection.execute(sql, params);

  //     if (result.affectedRows === 0) {
  //       return { status: 0, message: 'Leave application not found.' };
  //     }

  //     return {
  //       status: 1,
  //       message: 'Leave status updated successfully.'
  //     };
  //   } catch (error) {
  //     console.error('💥 Error updating leave status:', error);
  //     return {
  //       status: 0,
  //       message: 'Internal server error.',
  //       error: error.message,
  //     };
  //   } finally {
  //     if (connection) connection.release();
  //   }
  // }


async getStaffDashboardByUserId(userId: number): Promise<any> {
  if (!userId) {
    return { status: 0, message: 'User ID is required.' };
  }

  try {
    const staff = await this.staffRepository
      .createQueryBuilder('st')
      .innerJoin('st.user', 'u')
      .innerJoin('u.profile', 'up')
      .innerJoin('st.school', 's')
      .leftJoin(
        qb =>
          qb
            .from('staff_performance_evaluations', 'eval')
            .select([
              'eval.staff_id AS staff_id',
              'eval.overall_grade AS overall_grade',
              'ROW_NUMBER() OVER (PARTITION BY eval.staff_id ORDER BY eval.finalized_on DESC) AS rn',
            ])
            .where('eval.status = :status', { status: 'finalized' }),
        'latest_eval',
        'st.id = latest_eval.staff_id AND latest_eval.rn = 1'
      )
      .leftJoin(
        qb =>
          qb
            .from('staff_leave_applications', 'leave')
            .select('leave.staff_id', 'staff_id')
            .addSelect('SUM(leave.total_days)', 'total_leaves_taken')
            .where('leave.status = :approved', { approved: 'approved' })
            .andWhere('YEAR(leave.start_date) = :year', { year: 2024 })
            .groupBy('leave.staff_id'),
        'leave_balance',
        'st.id = leave_balance.staff_id'
      )
      .leftJoin(
        'salaries',
        'sal',
        'st.id = sal.staff_table_id AND sal.month = :month AND sal.year = :year',
        { month: 'July', year: 2024 }
      )
      .select([
        's.name AS school_name',
        'st.employee_id AS employee_id',
        'up.fullName AS full_name',
        'st.department AS department',
        'st.designation AS designation',
        'st.joiningDate AS joining_date',
        'st.experienceYears AS experience_years',
        'st.status AS status',
        "COALESCE(latest_eval.overall_grade, 'Not Evaluated') AS latest_performance_grade",
        'COALESCE(leave_balance.total_leaves_taken, 0) AS leaves_taken_this_year',
        'sal.total_salary AS current_salary',
      ])
      .where('st.status = :status', { status: 'active' })
      .andWhere('st.user_id = :userId', { userId })
      .orderBy('s.name')
      .addOrderBy('st.department')
      .addOrderBy('st.designation')
      .getRawOne();

    if (!staff) {
      return { status: 0, message: 'Staff dashboard data not found.' };
    }

    return {
      status: 1,
      message: 'Staff dashboard data fetched successfully.',
      data: staff,
    };
  } catch (error) {
    console.error('💥 Error fetching staff dashboard:', error);
    return {
      status: 0,
      message: 'Internal server error.',
      error: error.message,
    };
  }
}



async getSchoolDepartmentAnalytics(schoolId: number): Promise<any> {
  if (!schoolId) {
    return { status: 0, message: 'School ID is required.' };
  }

  try {
    const result = await this.staffRepository
      .createQueryBuilder('st')
      .innerJoin('st.school', 's')
      .leftJoin('staff_performance_evaluations', 'spe', `
        spe.staff_id = st.id 
        AND spe.status = 'finalized' 
        AND spe.evaluation_period_end >= :fromDate
      `, { fromDate: '2024-01-01' })
      .select('s.name', 'school_name')
      .addSelect('st.department', 'department')
      .addSelect('COUNT(*)', 'total_staff')
      .addSelect('AVG(spe.overall_score)', 'avg_performance_score')
      .addSelect(`
        COUNT(CASE WHEN spe.overall_grade IN ('A', 'A+') THEN 1 END)
      `, 'high_performers')
      .addSelect(`
        COUNT(CASE WHEN spe.overall_grade IN ('C', 'D', 'F') THEN 1 END)
      `, 'low_performers')
      .addSelect('AVG(st.experienceYears)', 'avg_experience')
      .where('st.status = :status', { status: 'active' })
      .andWhere('st.schoolId = :schoolId', { schoolId })
      .groupBy('s.id')
      .addGroupBy('st.department')
      .orderBy('avg_performance_score', 'DESC')
      .getRawMany();

    if (!result.length) {
      return { status: 0, message: 'No data found for the given school.' };
    }

    return {
      status: 1,
      message: 'School department analytics fetched successfully.',
      data: result,
    };
  } catch (error) {
    console.error('💥 Error fetching school analytics:', error);
    return {
      status: 0,
      message: 'Internal server error.',
      error: error.message,
    };
  }
}


async getLeaveSummaryBySchool(schoolId: number): Promise<any> {
  if (!schoolId) {
    return { status: 0, message: 'School ID is required.' };
  }

  try {
    const result = await this.leaveApplicationsRepository
      .createQueryBuilder('sla')
      .innerJoin('sla.staff', 'st')
      .innerJoin('st.school', 's')
      .innerJoin('sla.leaveType', 'lt')
      .select('s.name', 'school_name')
      .addSelect('st.department', 'department')
      .addSelect('lt.name', 'leave_type')
      .addSelect('COUNT(sla.id)', 'total_applications')
      .addSelect(`
        SUM(CASE WHEN sla.status = 'approved' THEN sla.totalDays ELSE 0 END)
      `, 'approved_days')
      .addSelect(`
        SUM(CASE WHEN sla.status = 'pending' THEN sla.totalDays ELSE 0 END)
      `, 'pending_days')
      .addSelect(`
        AVG(CASE WHEN sla.status = 'approved' THEN sla.totalDays ELSE NULL END)
      `, 'avg_leave_duration')
      .where('s.id = :schoolId', { schoolId })
      .andWhere('YEAR(sla.startDate) = :year', { year: 2024 })
      .groupBy('s.id')
      .addGroupBy('st.department')
      .addGroupBy('lt.id')
      .orderBy('s.name', 'ASC')
      .addOrderBy('st.department', 'ASC')
      .addOrderBy('total_applications', 'DESC')
      .getRawMany();

    return {
      status: 1,
      message: 'Leave summary by department and leave type fetched successfully.',
      data: result,
    };
  } catch (error) {
    console.error('💥 Error fetching leave summary:', error);
    return {
      status: 0,
      message: 'Internal server error.',
      error: error.message,
    };
  }
}



async getSalaryPerformanceBySchool(schoolId: number): Promise<any> {
  if (!schoolId) {
    return { status: 0, message: 'School ID is required.' };
  }

  try {
    const subqueryDeptAvg = this.staffRepository
      .createQueryBuilder('st2')
      .select('st2.school_id', 'school_id')
      .addSelect('st2.department', 'department')
      .addSelect('AVG(sal2.total_salary)', 'avg_salary')
      .innerJoin('st2.salaries', 'sal2', 'sal2.month = :month AND sal2.year = :year', {
        month: 'July',
        year: 2024,
      })
      .groupBy('st2.school_id')
      .addGroupBy('st2.department');

    const data = await this.staffRepository
      .createQueryBuilder('st')
      .innerJoin('st.school', 's')
      .innerJoin('st.user', 'u')
      .innerJoin('u.profile', 'up')
      .leftJoin('st.salaries', 'sal', 'sal.month = :month AND sal.year = :year', {
        month: 'July',
        year: 2024,
      })
      .leftJoin('st.staffPerformanceEvaluations', 'spe', `
        spe.status = 'finalized' AND spe.evaluation_period_end >= :evalStart
      `, { evalStart: '2024-01-01' })
      .leftJoin(
        '(' + subqueryDeptAvg.getQuery() + ')',
        'dept_avg',
        'st.school_id = dept_avg.school_id AND st.department = dept_avg.department'
      )
      .setParameters(subqueryDeptAvg.getParameters()) // required when embedding a subquery
      .where('st.status = :status AND s.id = :schoolId', { status: 'active', schoolId })
      .select('s.name', 'school_name')
      .addSelect('st.department', 'department')
      .addSelect('st.designation', 'designation')
      .addSelect('up.fullName', 'full_name')
      .addSelect('sal.total_salary', 'total_salary')
      .addSelect('COALESCE(spe.overall_score, 0)', 'performance_score')
      .addSelect("COALESCE(spe.overall_grade, 'N/A')", 'performance_grade')
      .addSelect(`
        CASE 
          WHEN sal.total_salary > dept_avg.avg_salary THEN 'Above Average'
          WHEN sal.total_salary < dept_avg.avg_salary THEN 'Below Average'
          ELSE 'Average'
        END
      `, 'salary_position')
      .orderBy('s.name', 'ASC')
      .addOrderBy('st.department', 'ASC')
      .addOrderBy('sal.total_salary', 'DESC')
      .getRawMany();

    return {
      status: 1,
      message: 'Salary and performance data fetched successfully.',
      data,
    };
  } catch (error) {
    console.error('💥 Error fetching salary-performance summary:', error);
    return {
      status: 0,
      message: 'Internal server error.',
      error: error.message,
    };
  }
}



async getAttendancePerformanceBySchool(schoolId: number): Promise<any> {
  if (!schoolId) {
    return { status: 0, message: 'School ID is required.' };
  }

  try {
    const qb = this.staffRepository
      .createQueryBuilder('st')
      .innerJoin('st.school', 's')
      .innerJoin('st.user', 'u')
      .innerJoin('u.profile', 'up')
      .leftJoin('st.staffAttendances', 'sa', 'sa.school_id = s.id')
      .leftJoin('st.staffPerformanceEvaluations', 'spe', `
        spe.status = 'finalized' AND spe.evaluation_period_end >= :evalStart
      `, { evalStart: '2024-01-01' })
      .where('st.status = :status AND s.id = :schoolId', {
        status: 'active',
        schoolId,
      })
      .select('s.name', 'school_name')
      .addSelect('up.fullName', 'full_name')
      .addSelect('st.department', 'department')
      .addSelect('COUNT(sa.id)', 'total_attendance_records')
      .addSelect(
        `SUM(CASE WHEN sa.status = 'present' THEN 1 ELSE 0 END)`,
        'present_days'
      )
      .addSelect(
        `ROUND(
          (SUM(CASE WHEN sa.status = 'present' THEN 1 ELSE 0 END) / COUNT(sa.id)) * 100, 2
        )`,
        'attendance_percentage'
      )
      .addSelect('COALESCE(spe.overall_score, 0)', 'performance_score')
      .addSelect("COALESCE(spe.overall_grade, 'N/A')", 'performance_grade')
      .groupBy('s.id')
      .addGroupBy('st.id')
      .addGroupBy('up.fullName')
      .addGroupBy('st.department')
      .addGroupBy('spe.overall_score')
      .addGroupBy('spe.overall_grade')
      .having('COUNT(sa.id) > 0')
      .orderBy('attendance_percentage', 'DESC');

    const rows = await qb.getRawMany();

    return {
      status: 1,
      message: 'Staff attendance and performance fetched successfully.',
      data: rows,
    };
  } catch (error) {
    console.error('💥 Error in attendance-performance summary:', error);
    return {
      status: 0,
      message: 'Internal server error.',
      error: error.message,
    };
  }
}


async getBudgetUtilizationBySchool(schoolId: number): Promise<any> {
  if (!schoolId) {
    return { status: 0, message: 'School ID is required.' };
  }

  try {
    const qb = this.schoolDepartmentRepository
      .createQueryBuilder('sd')
      .innerJoin('sd.school', 's')
      .leftJoin('staff', 'st', `
        st.school_id = sd.school_id AND 
        st.department = sd.name AND 
        st.status = 'active'
      `)
      .leftJoin('salaries', 'sal', `
        sal.staff_table_id = st.id AND 
        sal.month = 'July' AND 
        sal.year = 2024
      `)
      .select('s.name', 'school_name')
      .addSelect('sd.name', 'department_name')
      .addSelect('sd.budget', 'allocated_budget')
      .addSelect('COUNT(st.id)', 'staff_count')
      .addSelect('SUM(sal.total_salary)', 'monthly_salary_cost')
      .addSelect('(SUM(sal.total_salary) * 12)', 'annual_salary_cost')
      .addSelect('(sd.budget - (SUM(sal.total_salary) * 12))', 'budget_remaining')
      .addSelect(`
        ROUND(((SUM(sal.total_salary) * 12) / sd.budget) * 100, 2)
      `, 'budget_utilization_percentage')
      .where('sd.school_id = :schoolId', { schoolId })
      .groupBy('s.id')
      .addGroupBy('sd.id')
      .orderBy('budget_utilization_percentage', 'DESC');

    const rows = await qb.getRawMany();

    return {
      status: 1,
      message: 'Budget utilization fetched successfully.',
      data: rows,
    };
  } catch (error) {
    console.error('💥 Error fetching budget utilization:', error);
    return {
      status: 0,
      message: 'Internal server error.',
      error: error.message,
    };
  }
}


async getTrainingPriorityBySchool(schoolId: number): Promise<any> {
  if (!schoolId) {
    return { status: 0, message: 'School ID is required.' };
  }

  try {
    const qb = this.staffRepository
      .createQueryBuilder('st')
      .innerJoin('st.school', 's')
      .innerJoin('st.user', 'u')
      .innerJoin('u.userProfiles', 'up')
      .leftJoin('st.staffPerformanceEvaluations', 'spe', `
        spe.status = 'finalized' AND spe.evaluation_period_end >= '2024-01-01'
      `)
      .select('s.name', 'school_name')
      .addSelect('st.department', 'department')
      .addSelect('up.full_name', 'full_name')
      .addSelect('st.experience_years', 'experience_years')
      .addSelect('COALESCE(spe.overall_score, 0)', 'performance_score')
      .addSelect('spe.areas_for_improvement', 'areas_for_improvement')
      .addSelect('spe.goals_for_next_period', 'goals_for_next_period')
      .addSelect(`
        CASE 
          WHEN st.experience_years < 2 AND COALESCE(spe.overall_score, 0) < 7 THEN 'High Priority Training'
          WHEN st.experience_years < 5 AND COALESCE(spe.overall_score, 0) < 8 THEN 'Medium Priority Training'
          WHEN COALESCE(spe.overall_score, 0) < 6 THEN 'Performance Improvement Required'
          ELSE 'Standard Development'
        END
      `, 'training_priority')
      .where('st.status = :status', { status: 'active' })
      .andWhere('s.id = :schoolId', { schoolId })
      .orderBy(`
        CASE 
          WHEN st.experience_years < 2 AND COALESCE(spe.overall_score, 0) < 7 THEN 1
          WHEN COALESCE(spe.overall_score, 0) < 6 THEN 2
          WHEN st.experience_years < 5 AND COALESCE(spe.overall_score, 0) < 8 THEN 3
          ELSE 4
        END
      `);

    const results = await qb.getRawMany();

    return {
      status: 1,
      message: 'Training priority report fetched successfully.',
      data: results,
    };
  } catch (error) {
    console.error('Error fetching training priority report:', error);
    return {
      status: 0,
      message: 'Internal server error.',
      error: error.message,
    };
  }
}


async getStaffSummaryBySchool(schoolId: number): Promise<any> {
  if (!schoolId) {
    return { status: 0, message: 'School ID is required' };
  }

  try {
    const qb = this.staffRepository
      .createQueryBuilder('st')
      .innerJoin('st.school', 's')
      .select('s.name', 'school_name')
      .addSelect('st.department', 'department')
      .addSelect('COUNT(*)', 'total_staff')
      .addSelect("COUNT(CASE WHEN st.status = 'active' THEN 1 END)", 'active_staff')
      .addSelect("COUNT(CASE WHEN st.status = 'terminated' THEN 1 END)", 'terminated_staff')
      .addSelect(
        "COUNT(CASE WHEN st.joining_date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) THEN 1 END)",
        'new_joiners_last_year'
      )
      .addSelect('AVG(st.experience_years)', 'avg_experience')
      .addSelect(
        'AVG(DATEDIFF(CURDATE(), st.joining_date) / 365.25)',
        'avg_tenure_years'
      )
      .where('s.id = :schoolId', { schoolId })
      .groupBy('s.id')
      .addGroupBy('st.department')
      .orderBy('s.name')
      .addOrderBy('st.department');

    const results = await qb.getRawMany();

    return {
      status: 1,
      message: 'Staff department summary fetched successfully.',
      data: results,
    };
  } catch (error) {
    console.error('Error in getStaffSummaryBySchool:', error);
    return {
      status: 0,
      message: 'Internal server error.',
      error: error.message,
    };
  }
}



}
