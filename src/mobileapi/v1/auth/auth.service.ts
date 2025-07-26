// src/mobileapi/v1/auth/auth.service.ts
import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { pool } from '../../../config/db';

import { jwtConfig } from '../../../config/jwt.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
  ) { }

  async login(dto: LoginDto): Promise<any> {
    const { email, password } = dto;

    if (!email || !password) {
      return {
        status: 0,
        message: 'Email and password are required.',
      };
    }

    let connection;
    try {
      connection = await pool.getConnection();

      const [users]: any = await connection.execute(
        `SELECT u.id, u.username, u.email, u.password, u.role_id, p.full_name 
       FROM users u
       JOIN user_profiles p ON u.id = p.user_id
       WHERE u.email = ?`,
        [email],
      );

      if (users.length === 0) {
        return {
          status: 0,
          message: 'Invalid email or password.',
        };
      }

      const user = users[0];
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return {
          status: 0,
          message: 'Invalid email or password.',
        };
      }

      const payload = {
        userId: user.id,
        roleId: user.role_id,
        email: user.email,
        username: user.username,
      };

      const token = this.jwtService.sign(payload, {
        secret: jwtConfig.secret,
        expiresIn: jwtConfig.signOptions.expiresIn,
      });

      return {
        status: 1,
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          role_id: user.role_id,
        },
      };
    } catch (err) {
      console.error('Login Error:', err);
      return {
        status: 0,
        message: 'Login failed due to server error.',
      };
    } finally {
      if (connection) connection.release();
    }
  }






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
    class_id,
    admission_date,
    roll_number,
    guardian_name,
    student_id,
  } = body;

  if (!username || !email || !password || !role_id || !full_name || !gender || !dob || !address || !phone) {
    return { status: 0, message: 'Missing required fields.' };
  }

  if (isNaN(Number(role_id))) {
    return { status: 0, message: 'role_id must be a number.' };
  }

  let connection;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [userResult]: any = await connection.execute(
      `INSERT INTO users (username, email, password, role_id) VALUES (?, ?, ?, ?)`,
      [username, email, hashedPassword, role_id]
    );

    const newUserId = userResult.insertId;

    await connection.execute(
      `INSERT INTO user_profiles (user_id, full_name, gender, dob, address, phone) VALUES (?, ?, ?, ?, ?, ?)`,
      [newUserId, full_name, gender, dob, address, phone]
    );

    if (Number(role_id) === 5) {
      if (!class_id || !admission_date || !roll_number || !guardian_name) {
        await connection.rollback();
        return { status: 0, message: 'Missing student fields.' };
      }

      await connection.execute(
        `INSERT INTO students (user_id, class_id, admission_date, roll_number, guardian_name, address, phone) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [newUserId, class_id, admission_date, roll_number, guardian_name, address, phone]
      );
    }

    if (Number(role_id) === 6) {
      if (!student_id) {
        await connection.rollback();
        return { status: 0, message: 'Missing student_id for parent.' };
      }

      await connection.execute(
        `INSERT INTO parents (user_id, student_id) VALUES (?, ?)`,
        [newUserId, student_id]
      );
    }

    // ✅ Fetch the inserted user with profile for token and response
    const [users]: any = await connection.execute(
      `SELECT u.id, u.username, u.email, u.role_id, p.full_name 
       FROM users u
       JOIN user_profiles p ON u.id = p.user_id
       WHERE u.id = ?`,
      [newUserId]
    );

    const newUser = users[0];

    // ✅ Generate token
    const payload = {
      userId: newUser.id,
      roleId: newUser.role_id,
      email: newUser.email,
      username: newUser.username,
    };

    const token = this.jwtService.sign(payload);

    await connection.commit();

    return {
      status: 1,
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        full_name: newUser.full_name,
        role_id: newUser.role_id,
      },
    };
  } catch (error: any) {
    if (connection) await connection.rollback();
    console.error('Registration Error:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      const field = error.sqlMessage.includes('username') ? 'Username' : 'Email';
      return { status: 0, message: `${field} already exists.` };
    }

    return { status: 0, message: 'Registration failed.', error: error.message };
  } finally {
    if (connection) connection.release();
  }
}


}
