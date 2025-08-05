import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Parents } from '../entities/parents.entity';

import { Students } from '../entities/students.entity';
import { Users } from '../entities/users.entity';


@Injectable()
export class StudentsService {
    constructor(
      @InjectRepository(Users) private usersRepository: Repository<Users>,
      @InjectRepository(Students) private studentsRepository: Repository<Students>,
      @InjectRepository(Parents) private parentsRepository: Repository<Parents>,
  
      private readonly jwtService: JwtService,
    ) { }


async getClientParents(userId: number): Promise<any> {
  try {
    const parents = await this.parentsRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'user.userProfiles'],
    });

    if (!parents || parents.length === 0) {
      return {
        status: 0,
        message: 'No parents found for this student.',
      };
    }

    // Transform response
    const formattedParents = parents.map((p) => {
      const profile = p.user.userProfiles?.[0]; // Assuming one profile per user

      return {
        id: p.id,
        studentId: p.studentId,
        full_name: profile?.fullName || null,
        phone: profile?.phone || null,
        username: p.user.username,
        email: p.user.email,
        schoolId: p.schoolId,
        roleId: p.roleId,
        parentCode: p.parentCode,
      };
    });

    return {
      status: 1,
      message: 'Parents fetched successfully',
      parents: formattedParents,
    };
  } catch (error) {
    console.error('💥 Error fetching parents:', error);
    return {
      status: 0,
      message: 'Internal server error',
      error: error.message,
    };
  }
}

async getAllStudents(): Promise<any> {
  try {
    const students = await this.usersRepository.find({
      where: { roleId: 5 }, // 5 = Student role
      relations: ['role'],
      select: ['id', 'username', 'email', 'roleId'], // explicitly selecting
    });

    const formattedStudents = students.map((student) => ({
      id: student.id,
      username: student.username,
      email: student.email,
      role_id: student.roleId,
      role_name: student.role?.name ?? null,
    }));

    return {
      status: 1,
      message: 'Students fetched successfully',
      students: formattedStudents,
    };
  } catch (error) {
    console.error('Get All Students Error:', error);
    return {
      status: 0,
      message: 'Failed to fetch students due to server error.',
      error: error.message,
    };
  }
}


async getStudentById(userId: number): Promise<any> {
  if (!userId) {
    return { status: 0, message: 'User ID is required.' };
  }

  try {
    const user = await this.usersRepository.findOne({
      where: { id: userId, roleId: 5 }, // roleId 5 = student
      relations: ['role'], // loads related role entity
    });

    if (!user) {
      return {
        status: 0,
        message: 'User not found',
      };
    }

    return {
      status: 1,
      message: 'User fetched successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role_id: user.roleId,
        role_name: user.role?.name ?? null,
      },
    };
  } catch (error) {
    console.error('Get User by ID Error:', error);
    return {
      status: 0,
      message: 'Failed to fetch user due to server error',
      error: error.message,
    };
  }
}

async getParentsByStudentId(studentId: number): Promise<any> {
  if (!studentId) {
    return {
      status: 0,
      message: 'Student ID is required.',
    };
  }

  try {
    const parents = await this.parentsRepository.find({
      where: { student: { id: studentId } },
      relations: ['user', 'user.userProfiles'],
    });

    if (!parents.length) {
      return {
        status: 0,
        message: 'No parents found for the given student ID.',
      };
    }

    const formattedParents = parents.map((p) => ({
      id: p.id,
      user_id: p.user?.id,
      full_name: p.user?.userProfiles?.[0]?.fullName ?? null,
      phone: p.user?.userProfiles?.[0]?.phone ?? null,
      username: p.user?.username ?? null,
      email: p.user?.email ?? null,
      role_id: p.roleId,
      school_id: p.schoolId,
    }));

    return {
      status: 1,
      message: 'Parents fetched successfully',
      parents: formattedParents,
    };
  } catch (error) {
    console.error('Get Parents Error:', error);
    return {
      status: 0,
      message: 'Failed to fetch parents due to server error.',
      error: error.message,
    };
  }
}



async linkParentToStudent(parent_user_id: number, student_id: number): Promise<any> {
  if (!parent_user_id || !student_id) {
    return {
      status: 0,
      message: 'Parent user ID and student ID are required.',
    };
  }

  try {
    const user = await this.usersRepository.findOne({ where: { id: parent_user_id } });
    const student = await this.studentsRepository.findOne({ where: { id: student_id } });

    if (!user || !student) {
      return {
        status: 0,
        message: 'Invalid parent user or student ID.',
      };
    }

    const parent = this.parentsRepository.create({
      user,
      student,
    });

    const savedParent = await this.parentsRepository.save(parent);

    return {
      status: 1,
      message: 'Parent linked to student successfully',
      insertId: savedParent.id,
    };
  } catch (error) {
    console.error('Link Parent Error:', error);
    return {
      status: 0,
      message: 'Failed to link parent to student',
      error: error.message,
    };
  }
}

}
