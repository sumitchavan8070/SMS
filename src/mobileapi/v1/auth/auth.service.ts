// src/mobileapi/v1/auth/auth.service.ts
import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { pool } from '../../../config/db';

import { jwtConfig } from '../../../config/jwt.config';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/users.entity';
import { Repository } from 'typeorm/repository/Repository';
import { UserProfiles } from '../entities/userprofiles.entity';
import { Students } from '../entities/students.entity';
import { Parents } from '../entities/parents.entity';
import { DataSource } from 'typeorm';
import { Staff } from '../entities/staff.entity';
import { Classes } from '../entities/classes.entity';
import { Roles } from '../entities/roles.entity';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(UserProfiles) private userProfilesRepository: Repository<UserProfiles>,
    @InjectRepository(Students) private studentsRepository: Repository<Students>,
    @InjectRepository(Parents) private parentsRepository: Repository<Parents>,
    @InjectRepository(Staff) private staffRepository: Repository<Staff>,
    @InjectRepository(Classes) private classesRepository: Repository<Classes>,
    @InjectRepository(Roles) private rolesRepository: Repository<Roles>,
    private dataSource: DataSource, // 👈 for transaction support

    private readonly jwtService: JwtService,
  ) { }


  private async getClassNameById(classId: number): Promise<string> {
    const classEntity = await this.classesRepository.findOne({
      where: { id: classId },
    });

    const rawName = classEntity?.name || 'NA';
    return rawName.replace(/class\s*/i, '').replace(/\s+/g, '');
  }


  private async generateUserCode(
    roleId: number,
    admissionYear: number,
    className: string | null,
    rollNumber: number | null,
  ): Promise<string> {
    const SCHOOL_CODE = 'STM';

    const roleMap: Record<number, string> = {
      1: 'PR', // Principal
      2: 'IT', // IT
      3: 'AC', // Accountant
      4: 'TC', // Teacher
      5: 'ST', // Student
      6: 'PT', // Parent
    };

    const roleCode = roleMap[roleId];
    let serial = '';

    const cleanClassName = className?.replace(/class\s*/i, '').replace(/\s+/g, '') || '';

    // 🧑‍🎓 Student
    if (roleId === 5 && cleanClassName && rollNumber !== null) {
      serial = String(rollNumber).padStart(3, '0');
      return `${SCHOOL_CODE}${admissionYear}${roleCode}${cleanClassName}${serial}`;
    }

    // 👨‍🏫 Teacher
    // else if (roleId === 4 && cleanClassName) {
    //   const count = await this.staffRepository.count({
    //     where: { : cleanClassName }, // Assuming staff has classId field
    //   });
    //   serial = String(count + 1).padStart(3, '0');
    //   return `${SCHOOL_CODE}${admissionYear}${roleCode}${cleanClassName}${serial}`;
    // }

    // 👨‍👩‍👧‍👦 Parent or other roles
    else {
      let count = 0;
      if (roleId === 6) {
        count = await this.parentsRepository.count({ where: { roleId } });
      } else {
        count = await this.usersRepository.count({ where: { roleId } });
      }

      serial = String(count + 1).padStart(3, '0');
      return `${SCHOOL_CODE}${admissionYear}${roleCode}${serial}`;
    }
  }


  // async login(dto: LoginDto): Promise<any> {
  //   const { email, password } = dto;

  //   if (!email || !password) {
  //     return {
  //       status: 0,
  //       message: 'Email and password are required.',
  //     };
  //   }

  //   let connection;
  //   try {
  //     connection = await pool.getConnection();

  //     const [users]: any = await connection.execute(
  //       `SELECT u.id, u.username, u.email, u.password, u.role_id, p.full_name 
  //      FROM users u
  //      JOIN user_profiles p ON u.id = p.user_id
  //      WHERE u.email = ?`,
  //       [email],
  //     );

  //     if (users.length === 0) {
  //       return {
  //         status: 0,
  //         message: 'Invalid email or password.',
  //       };
  //     }

  //     const user = users[0];
  //     const match = await bcrypt.compare(password, user.password);

  //     if (!match) {
  //       return {
  //         status: 0,
  //         message: 'Invalid email or password.',
  //       };
  //     }

  //     const payload = {
  //       userId: user.id,
  //       roleId: user.role_id,
  //       email: user.email,
  //       username: user.username,
  //     };

  //     const token = this.jwtService.sign(payload, {
  //       secret: jwtConfig.secret,
  //       expiresIn: jwtConfig.signOptions.expiresIn,
  //     });

  //     return {
  //       status: 1,
  //       message: 'Login successful',
  //       token,
  //       user: {
  //         id: user.id,
  //         username: user.username,
  //         email: user.email,
  //         full_name: user.full_name,
  //         role_id: user.role_id,
  //       },
  //     };
  //   } catch (err) {
  //     console.error('Login Error:', err);
  //     return {
  //       status: 0,
  //       message: 'Login failed due to server error.',
  //     };
  //   } finally {
  //     if (connection) connection.release();
  //   }
  // }






  // data for a Student
  // {
  //   "username": "amitkumar",
  //   "email": "amit.kumar@example.com",
  //   "password": "AmitPass@123",
  //   "role_id": 5,
  //   "full_name": "Amit Kumar",
  //   "gender": "male",
  //   "dob": "2006-03-12",
  //   "address": "45 School Road, Lucknow",
  //   "phone": "9812345678",
  //   "class_id": 3,
  //   "admission_date": "2023-04-10",
  //   "roll_number": 21,
  //   "guardian_name": "Ravi Kumar"
  // }




  // data for a Parent
  // {
  //   "username": "parentuser",
  //   "email": "parent@example.com",
  //   "password": "SecurePass123",
  //   "role_id": 6,
  //   "full_name": "Michael Smith",
  //   "gender": "male",
  //   "dob": "1980-01-01",
  //   "address": "456 Elm Street, Town",
  //   "phone": "9876543211",
  //   "student_id": 42
  // }



  // Sample POST data for a Teacher/Admin
  //   {
  //   "username": "teacheruser",
  //   "email": "teacher@example.com",
  //   "password": "TeachPass456",
  //   "role_id": 2,
  //   "full_name": "Alice Johnson",
  //   "gender": "female",
  //   "dob": "1990-05-20",
  //   "address": "789 Oak Road, Village",
  //   "phone": "9123456789"
  // }

  async login(dto: LoginDto): Promise<any> {
    const { email, password } = dto;
    try {
      const user = await this.usersRepository.findOne({
        where: { email },
        relations: ['role', 'school', 'userProfiles'],
      });

      if (!user) {
        return {
          status: 0,
          message: 'Invalid email or password.',
        };
      }


      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return {
          status: 0,
          message: 'Invalid email or password.',
        };
      }



      const payload = {
        userId: user.id,
        email: user.email,
        roleId: user.roleId,
      };

      const access_token = this.jwtService.sign(payload, {
        secret: jwtConfig.secret,
        expiresIn: jwtConfig.signOptions.expiresIn,
      });

      // Safely extract full name or split into first/last name if needed
      const fullName = user.userProfiles?.[0]?.fullName || '';
      const [firstName = '', lastName = ''] = fullName.split(' ');

      return {
        status: 1,
        access_token,
        user: {
          id: user.id,
          firstName,
          lastName,
          email: user.email,
          role: user.role,     // full role entity or customize below
          school: user.school, // full school entity or customize below
        },
      };
    } catch (err) {
      console.error('Login Error:', err);
      return {
        status: 0,
        message: 'Login failed due to server error.',
      };
    }
  }


  async register(body: any): Promise<any> {
    const {
      username,
      email,
      password,
      role_id,
      full_name,
      gender,
      dob,
      address,
      phone,
      school_id,
      class_id,
      admission_date,
      roll_number,
      guardian_name,
      student_id,
    } = body;

    if (
      !username || !email || !password || !role_id || !full_name ||
      !gender || !dob || !address || !phone || !school_id
    ) {
      return { status: 0, message: 'Missing required fields.' };
    }

    if (isNaN(Number(role_id))) {
      return { status: 0, message: 'role_id must be a number.' };
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = this.usersRepository.create({
        username,
        email,
        password: hashedPassword,
        roleId: role_id,
        schoolId: school_id,
      });
      await this.usersRepository.save(user);

      // Create user profile
      const userProfile = this.userProfilesRepository.create({
        user, // relation
        fullName: full_name,
        gender,
        dob,
        address,
        phone,
      });
      await this.userProfilesRepository.save(userProfile);

      // Generate code (optional logic you already have)
      const admissionYear = admission_date ? new Date(admission_date).getFullYear() : new Date().getFullYear();
      const className = class_id ? await this.getClassNameById(class_id) : null;
      const generatedCode = await this.generateUserCode(
        Number(role_id),
        admissionYear,
        className,
        roll_number ?? null,
      );

      // Handle student
      if (Number(role_id) === 5) {
        if (!class_id || !admission_date || !roll_number || !guardian_name) {
          return { status: 0, message: 'Missing student fields.' };
        }

        const student = this.studentsRepository.create({
          user,
          classId: class_id,
          admissionDate: admission_date,
          rollNumber: roll_number,
          guardianName: guardian_name,
          address,
          phone,
          studentCode: generatedCode,
          schoolId: school_id,
        });
        await this.studentsRepository.save(student);
      }

      // Handle parent
      if (Number(role_id) === 6) {
        if (!student_id) {
          return { status: 0, message: 'Missing student_id for parent.' };
        }

        const parent = this.parentsRepository.create({
          user,
          studentId: student_id,
          parentCode: generatedCode,
          fullName: full_name,
          username,
          password: hashedPassword,
          roleId: role_id,
          schoolId: school_id,
        });
        await this.parentsRepository.save(parent);
      }

      // Generate token
      const payload = {
        userId: user.id,
        roleId: role_id,
        email: user.email,
        username: user.username,
      };
      const token = this.jwtService.sign(payload);

      return {
        status: 1,
        message: 'User registered successfully',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name,
          role_id: role_id,
          generated_code: generatedCode,
          school_id,
        },
      };
    } catch (error) {
      console.error('Registration Error:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        const field = error.message.includes('username') ? 'Username' : 'Email';
        return { status: 0, message: `${field} already exists.` };
      }
      return { status: 0, message: 'Registration failed.', error: error.message };
    }
  }




  async getClientProfile(userId: number): Promise<any> {
    if (!userId) {
      return { status: 0, message: 'User ID is required.' };
    }

    try {
      const profile = await this.userProfilesRepository.findOne({
        where: { user: { id: userId } },
        relations: ['user', 'user.role'],
      });

      if (!profile) {
        return { status: 0, message: 'User profile not found.' };
      }

      const { user } = profile;

      return {
        status: 1,
        message: 'User profile fetched successfully.',
        profile: {
          id: profile.id,
          fullName: profile.fullName,
          gender: profile.gender,
          dob: profile.dob,
          address: profile.address,
          phone: profile.phone,
          username: user.username,
          email: user.email,
          role_name: user.role?.name || null,
        },
      };
    } catch (error) {
      console.error('💥 Error fetching user profile:', error);
      return {
        status: 0,
        message: 'Internal server error.',
        error: error.message,
      };
    }
  }




  async updateClientProfile(userId: number, roleId: number, body: any): Promise<any> {
    const {
      username,
      email,
      password,
      full_name,
      gender,
      dob,
      address,
      phone,
      class_id,
      admission_date,
      roll_number,
      guardian_name,
      student_id,
    } = body;

    if (!username || !email || !full_name || !gender || !dob || !address || !phone) {
      return { status: 0, message: 'Missing required fields.' };
    }

    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
        relations: ['profile'],
      });

      if (!user) {
        return { status: 0, message: 'User not found.' };
      }

      // ✅ Update users table
      user.username = username;
      user.email = email;
      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }
      await this.usersRepository.save(user);

      // ✅ Update user_profiles table
      const profile = await this.userProfilesRepository.findOneBy({ user: { id: userId } });
      if (profile) {
        profile.fullName = full_name;
        profile.gender = gender;
        profile.dob = dob;
        profile.address = address;
        profile.phone = phone;
        await this.userProfilesRepository.save(profile);
      }

      // ✅ Update student table if relevant data is provided
      if (class_id && admission_date && roll_number && guardian_name) {
        const student = await this.studentsRepository.findOneBy({ user: { id: userId } });
        if (student) {
          student.classId = class_id;
          student.admissionDate = admission_date;
          student.rollNumber = roll_number;
          student.guardianName = guardian_name;
          student.address = address;
          student.phone = phone;
          await this.studentsRepository.save(student);
        }
      }

      // ✅ Update parents table if user is parent of current student
      if (student_id) {
        const parent = await this.parentsRepository.findOneBy({ studentId: student_id });
        if (parent) {

          await this.parentsRepository.save(parent);
        }
      }

      return {
        status: 1,
        message: 'User profile updated successfully',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: full_name,
          role_id: roleId,
        },
      };
    } catch (error) {
      console.error('Update Error:', error);
      return { status: 0, message: 'Update failed.', error: error.message };
    }
  }




  async getRoles(): Promise<any> {
    try {
      const roles = await this.rolesRepository.find(); // fetch all roles

      return {
        status: 1,
        message: 'Roles fetched successfully',
        roles,
      };
    } catch (error) {
      console.error('💥 Error fetching roles:', error);
      return {
        status: 0,
        message: 'Failed to fetch roles',
      };
    }
  }


async updateAllStudentCodes(): Promise<any> {
  try {
    const students = await this.studentsRepository
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.user', 'u')
      .leftJoinAndSelect('s.class', 'c')
      .select([
        's.id',
        's.userId',
        's.classId',
        's.admissionDate',
        's.rollNumber',
        'u.roleId',
        'c.name',
      ])
      .getMany();

    for (const student of students) {
      const { user, classId, admissionDate, rollNumber, class: classEntity } = student;

      const admissionYear = new Date(String(admissionDate)).getFullYear();
      const cleanedClassName = classEntity.name.replace(/class\s*/i, '').replace(/\s+/g, '');

      const studentCode = await this.generateUserCode(
        Number(user.roleId),
        admissionYear,
        cleanedClassName,
        rollNumber,
      );

      student.studentCode = studentCode;
      await this.studentsRepository.save(student);

      console.log(`✅ Updated student_code for user_id ${user.id}: ${studentCode}`);
    }

    console.log('🎉 All student codes updated.');
    return { status: 1, message: 'All student codes updated successfully.' };

  } catch (error) {
    console.error('❌ Failed to update student codes:', error);
    return { status: 0, message: 'Failed to update student codes.', error: error.message };
  }
}




}
