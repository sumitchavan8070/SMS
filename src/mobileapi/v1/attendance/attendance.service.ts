import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { Students } from '../entities/students.entity';
import { Staff } from '../entities/staff.entity';
import { StaffAttendance } from '../entities/staffattendance.entity';
import { Attendance } from '../entities/attendance.entity';
import { AuthService } from '../auth/auth.service';
import { DataSource } from 'typeorm';
import { Users } from '../entities/users.entity';




interface UserProfile {
  fullName: string;
  gender: string;
  dob: string;
  address: string;
  phone: string;
  username: string;
  email: string;
  role_name: string;
}


@Injectable()
export class AttendanceService {

  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,

    @InjectRepository(Students)
    private readonly studentRepository: Repository<Students>,

    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,

    @InjectRepository(StaffAttendance)
    private readonly staffAttendanceRepository: Repository<StaffAttendance>,


    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,



      private readonly authService: AuthService, // <- ✅ Injected here




  ) { }





async getAllStudentAttendance(): Promise<{
  status: number;
  message: string;
  data?: any[];
  error?: string;
}> {
  try {
    const records = await this.attendanceRepository.find({
      relations: ['student', 'student.class', 'student.user'],
    });

    const data = await Promise.all(
      records.map(async (att) => {
        const userId = att.student?.user?.id;

  let profileData: UserProfile | null = null;
        if (userId) {
          const profileResult = await this.authService.getClientProfile(userId);
          if (profileResult.status === 1) {
            profileData = profileResult.profile;
          }
        }

        return {
          id: att.id,
          date: att.date,
          status: att.status,
          remarks: att.remarks,
          student_id: att.student?.id || null,
          student_name: profileData?.fullName ,
          class_name: att.student?.class?.name || '',
          roll_number: att.student?.roll_number || '',
          gender: profileData?.gender || '',
          phone: profileData?.phone || '',
          email: profileData?.email || '',
          role: profileData?.role_name || '',
        };
      }),
    );

    return {
      status: 1,
      message: 'Attendance records retrieved successfully.',
      data,
    };
  } catch (error) {
    console.error('Attendance Fetch Error:', error);
    return {
      status: 0,
      message: 'Failed to fetch attendance records.',
      error: error.message,
    };
  }
}





  // async getAttendanceByDateRange(
  //   user: { roleId: number; userId: number },
  //   body: { from_date: string; to_date: string; class_id?: number },
  // ): Promise<{
  //   status: number;
  //   message: string;
  //   data?: any[];
  //   error?: string;
  // }> {
  //   const { from_date, to_date, class_id } = body;
  //   const { roleId, userId } = user;

  //   if (!from_date || !to_date) {
  //     return { status: 0, message: 'Missing from_date or to_date' };
  //   }

  //   try {
  //     const qb = this.attendanceRepository.createQueryBuilder('a')
  //       .leftJoinAndSelect('a.student', 's')
  //       .leftJoinAndSelect('s.class', 'c')
  //       .where('a.date BETWEEN :from AND :to', {
  //         from: from_date,
  //         to: to_date,
  //       });

  //     if (roleId === 5) {
  //       qb.andWhere('s.user_id = :userId', { userId });

  //       // Optional: Validate student's class ID from DB (stronger validation)
  //       if (class_id) {
  //         qb.andWhere('s.class_id = :classId', { classId: class_id });
  //       }
  //     } else {
  //       if (!class_id) {
  //         return {
  //           status: 0,
  //           message: 'Missing class_id for admin/teacher role',
  //         };
  //       }
  //       qb.andWhere('s.class_id = :classId', { classId: class_id });
  //     }

  //     const records = await qb.getMany();

  //     const data = records.map(att => ({
  //       id: att.id,
  //       status: att.status,
  //       date: att.date,
  //       student_id: att.student_id,
  //       roll_number: att.student.roll_number,
  //       class_name: att.student.class?.name || '',
  //     }));

  //     return {
  //       status: 1,
  //       message: 'Attendance retrieved successfully.',
  //       data,
  //     };
  //   } catch (error) {
  //     return {
  //       status: 0,
  //       message: 'Error fetching attendance',
  //       error: error.message,
  //     };
  //   }
  // }






async getMonthlyAttendanceSummary(
  roleId: number,
  userId: number,
  date: string
): Promise<{
  status: number;
  message: string;
  data?: any[];
  error?: string;
}> {
  try {
    const inputDate = new Date(date);
    if (isNaN(inputDate.getTime())) {
      return { status: 0, message: 'Invalid date format' };
    }

    const fromDate = new Date(inputDate.getFullYear(), inputDate.getMonth(), 1);
    const toDate = new Date(inputDate.getFullYear(), inputDate.getMonth() + 1, 0);

    const formattedFrom = fromDate.toISOString().split('T')[0];
    const formattedTo = toDate.toISOString().split('T')[0];

    // === STUDENT ===
    if (roleId === 5) {
      const student = await this.studentRepository.findOne({
        where: { user: { id: userId } },
        relations: ['user', 'class'],
      });

      if (!student) {
        return { status: 0, message: 'Student not found' };
      }

      const records = await this.attendanceRepository
        .createQueryBuilder('sa')
        .leftJoin('sa.student', 's')
        .leftJoin('s.user', 'u')
        .leftJoin('u.userProfiles', 'up')
        .leftJoin('s.class', 'c')
        .select([
          'sa.id AS id',
          'sa.date AS date',
          'sa.status AS status',
          'sa.student_id AS student_id',
          'up.full_name AS student_name',
          'c.name AS class_name',
          's.roll_number AS roll_number',
        ])
        .where('s.user_id = :userId', { userId })
        .andWhere('sa.date BETWEEN :from AND :to', {
          from: formattedFrom,
          to: formattedTo,
        })
        .orderBy('sa.date', 'ASC')
        .getRawMany();

      return {
        status: 1,
        message: 'Student attendance retrieved successfully',
        data: records,
      };
    }

    // === STAFF ===
    const staffUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role', 'userProfiles'],
    });

    if (!staffUser) {
      return { status: 0, message: 'Staff not found' };
    }

    const records = await this.staffAttendanceRepository
      .createQueryBuilder('sa')
      .leftJoin('users', 'u', 'sa.staff_id = u.id')
      .leftJoin('user_profiles', 'up', 'u.id = up.user_id')
      .leftJoin('roles', 'r', 'u.role_id = r.id')
      .select([
        'sa.id AS id',
        'sa.date AS date',
        'sa.status AS status',
        'sa.staff_id AS staff_id',
        'up.full_name AS staff_name',
        'r.name AS role_name',
        'u.username AS username',
        'u.email AS email',
      ])
      .where('u.id = :userId', { userId })
      .andWhere('sa.date BETWEEN :from AND :to', {
        from: formattedFrom,
        to: formattedTo,
      })
      .orderBy('sa.date', 'ASC')
      .getRawMany();

    return {
      status: 1,
      message: 'Staff attendance retrieved successfully',
      data: records,
    };
  } catch (error) {
    console.error('Attendance Summary Error:', error);
    return {
      status: 0,
      message: 'Error fetching attendance summary',
      error: error.message,
    };
  }
}




  async markAttendance(body: CreateAttendanceDto, roleId: number,): Promise<any> {
    const { student_id, date, status, remarks } = body;

    if (roleId == 3 || roleId || 5) {
      return {
        status: 0,
        message: 'You are not autorized for this task ',
        roleId,

      };

    }

    try {
      const attendance = this.attendanceRepository.create({
        student: { id: student_id },
        date,
        // status,
        remarks,
      });

      const saved = await this.attendanceRepository.save(attendance);

      return {
        status: 1,
        message: 'Attendance marked successfully',
        data: saved,
      };
    } catch (error) {
      return {
        status: 0,
        message: 'Error marking attendance',
        error: error.message,
      };
    }
  }


}


