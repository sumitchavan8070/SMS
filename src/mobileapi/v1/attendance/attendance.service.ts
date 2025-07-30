import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Attendance } from './entities/attendance.entity';
import { Student } from './entities/student.entity';
import { UserProfile } from './entities/user-profile.entity';
import { Class } from './entities/class.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
  ) { }

  async getAllStudentAttendance(): Promise<{
    status: number;
    message: string;
    data?: any[];
    error?: string;
  }> {
    try {
      const records = await this.attendanceRepository.find({
        relations: ['student', 'student.userProfile', 'student.class'],
      });

      const data = records.map(att => ({

        ...att,
        student_name: att.student.userProfile.full_name,
        class_name: att.student.class.name,
        roll_number: att.student.roll_number,
      }));



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

  async getAttendanceByDateRange(
    user: { roleId: number; userId: number },
    body: { from_date: string; to_date: string; class_id?: number },
  ): Promise<{
    status: number;
    message: string;
    data?: any[];
    error?: string;
  }> {
    const { from_date, to_date, class_id } = body;
    const { roleId, userId } = user;

    if (!from_date || !to_date) {
      return { status: 0, message: 'Missing from_date or to_date' };
    }

    try {
      const qb = this.attendanceRepository.createQueryBuilder('a')
        .leftJoinAndSelect('a.student', 's')
        .leftJoinAndSelect('s.class', 'c')
        .where('a.date BETWEEN :from AND :to', {
          from: from_date,
          to: to_date,
        });

      if (roleId === 5) {
        qb.andWhere('s.user_id = :userId', { userId });

        // Optional: Validate student's class ID from DB (stronger validation)
        if (class_id) {
          qb.andWhere('s.class_id = :classId', { classId: class_id });
        }
      } else {
        if (!class_id) {
          return {
            status: 0,
            message: 'Missing class_id for admin/teacher role',
          };
        }
        qb.andWhere('s.class_id = :classId', { classId: class_id });
      }

      const records = await qb.getMany();

      const data = records.map(att => ({
        id: att.id,
        status: att.status,
        date: att.date,
        student_id: att.student_id,
        roll_number: att.student.roll_number,
        class_name: att.student.class?.name || '',
      }));

      return {
        status: 1,
        message: 'Attendance retrieved successfully.',
        data,
      };
    } catch (error) {
      return {
        status: 0,
        message: 'Error fetching attendance',
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
        status,
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
