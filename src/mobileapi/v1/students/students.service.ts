import { Injectable } from '@nestjs/common';
import { pool } from '../../../config/db';


@Injectable()
export class StudentsService {


  async getClientParents(userId: number): Promise<any> {
    let connection;
    try {
      connection = await pool.getConnection();

      const [parents] = await connection.execute(
        `SELECT p.*, up.full_name, up.phone, u.username, u.email
         FROM parents p
         JOIN user_profiles up ON p.user_id = up.user_id
         JOIN users u ON p.user_id = u.id
         WHERE p.user_id = ?`,
        [userId]
      );

      if ((parents as any[]).length === 0) {
        return {
          status: 0,
          message: 'No parents found for this student.',
        };
      }

      return {
        status: 1,
        message: 'Parents fetched successfully',
        parents,
      };
    } catch (error) {
      console.error('💥 Error fetching parents:', error);
      return {
        status: 0,
        message: 'Internal server error',
      };
    } finally {
      if (connection) connection.release();
    }
  }

  async getAllStudents(): Promise<any> {
    let connection;

    try {
      connection = await pool.getConnection();

      const [students]: any = await connection.execute(`
      SELECT u.id, u.username, u.email, u.role_id, r.name AS role_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.role_id = 5
    `,);

      return {
        status: 1,
        message: 'Students fetched successfully',
        students,
      };
    } catch (error) {
      console.error('Get All Students Error:', error);
      return {
        status: 0,
        message: 'Failed to fetch students due to server error.',
      };
    } finally {
      if (connection) connection.release();
    }
  }


  async getStudentById(userId: number): Promise<any> {
    let connection;

    try {
      connection = await pool.getConnection();

      const [results]: any = await connection.execute(
        `SELECT u.*, r.name AS role_name
         FROM users u
         JOIN roles r ON u.role_id = r.id
         WHERE u.id = ?`,
        [userId],
      );

      if (results.length === 0) {
        return {
          status: 0,
          message: 'User not found',
        };
      }

      return {
        status: 1,
        message: 'User fetched successfully',
        user: results[0],
      };
    } catch (error) {
      console.error('Get User by ID Error:', error);
      return {
        status: 0,
        message: 'Failed to fetch user due to server error',
      };
    } finally {
      if (connection) connection.release();
    }
  }

  async getParentsByStudentId(studentId: number): Promise<any> {
  let connection;

  try {
    connection = await pool.getConnection();

    const [results]: any = await connection.execute(
      `SELECT p.*, up.full_name, up.phone, u.username, u.email
       FROM parents p
       JOIN user_profiles up ON p.user_id = up.user_id
       JOIN users u ON p.user_id = u.id
       WHERE p.student_id = ?`,
      [studentId],
    );

    if (results.length === 0) {
      return {
        status: 0,
        message: 'No parents found for the given student ID.',
      };
    }

    return {
      status: 1,
      message: 'Parents fetched successfully',
      parents: results,
    };
  } catch (error) {
    console.error('Get Parents Error:', error);
    return {
      status: 0,
      message: 'Failed to fetch parents due to server error.',
    };
  } finally {
    if (connection) connection.release();
  }
}


async linkParentToStudent(parent_user_id: number, student_id: number): Promise<any> {
  let connection;

  try {
    connection = await pool.getConnection();

    const [result]: any = await connection.execute(
      `INSERT INTO parents (user_id, student_id) VALUES (?, ?)`,
      [parent_user_id, student_id],
    );

    return {
      status: 1,
      message: 'Parent linked to student successfully',
      insertId: result.insertId,
    };
  } catch (error) {
    console.error('Link Parent Error:', error);
    return {
      status: 0,
      message: 'Failed to link parent to student',
      error: error.message,
    };
  } finally {
    if (connection) connection.release();
  }
}
}
