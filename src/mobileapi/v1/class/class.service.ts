import { Injectable } from '@nestjs/common';
import { pool } from '../../../config/db'; // Make sure this path is correct

@Injectable()
export class ClassService {
  async getAllClasses(): Promise<any> {
    let connection;

    try {
      connection = await pool.getConnection();

      const [results]: any = await connection.execute(
        `SELECT * FROM classes`
      );

      return {
        status: 1,
        message: 'Classes fetched successfully',
        classes: results,
      };
    } catch (error) {
      console.error('Get Classes Error:', error);
      return {
        status: 0,
        message: 'Failed to fetch classes',
        error: error.message,
      };
    } finally {
      if (connection) connection.release();
    }
  }


  async getClassById(class_id: number): Promise<any> {
    let connection;

    try {
      connection = await pool.getConnection();

      const [results]: any = await connection.execute(
        `SELECT * FROM classes WHERE id = ?`,
        [class_id],
      );

      if (results.length === 0) {
        return {
          status: 0,
          message: 'Class not found',
        };
      }

      return {
        status: 1,
        message: 'Class fetched successfully',
        class: results[0],
      };
    } catch (error) {
      console.error('Get Class By ID Error:', error);
      return {
        status: 0,
        message: 'Failed to fetch class',
        error: error.message,
      };
    } finally {
      if (connection) connection.release();
    }
  }

   async createClass(class_name: string): Promise<any> {
    let connection;

    try {
      connection = await pool.getConnection();

      const [result]: any = await connection.execute(
        `INSERT INTO classes (name) VALUES (?)`,
        [class_name],
      );

      return {
        status: 1,
        message: 'Class created successfully',
        class_id: result.insertId,
      };
    } catch (error) {
      console.error('Create Class Error:', error);
      return {
        status: 0,
        message: 'Failed to create class',
        error: error.message,
      };
    } finally {
      if (connection) connection.release();
    }
  }


  async getAllSubjects(): Promise<any> {
    let connection;

    try {
      connection = await pool.getConnection();

      const [subjects]: any = await connection.execute(`
        SELECT s.*, c.name AS class_name, up.full_name AS teacher_name
        FROM subjects s
        JOIN classes c ON s.class_id = c.id
        LEFT JOIN user_profiles up ON s.teacher_id = up.user_id;
      `);

      return {
        status: 1,
        message: 'Subjects fetched successfully',
        subjects,
      };
    } catch (error) {
      console.error('Get Subjects Error:', error);
      return {
        status: 0,
        message: 'Failed to fetch subjects',
        error: error.message,
      };
    } finally {
      if (connection) connection.release();
    }
  }

  async getSubjectsByClassId(class_id: number): Promise<any> {


    let connection;
    try {
      connection = await pool.getConnection();
      const [results]: any = await connection.execute(
        `SELECT s.*, up.full_name AS teacher_name
         FROM subjects s
         LEFT JOIN user_profiles up ON s.teacher_id = up.user_id
         WHERE s.class_id = ?`,
        [class_id],
      );

      if (results.length === 0) {
        return {
          status: 0,
          message: 'No subjects found for this class',
        };
      }

      return {
        status: 1,
        message: 'Subjects fetched successfully',
        subjects: results,
      };
    } catch (error) {
      console.error('Get Subjects By Class ID Error:', error);
      return {
        status: 0,
        message: 'Failed to fetch subjects',
        error: error.message,
      };
    } finally {
      if (connection) connection.release();
    }
  }


   async getSubjectsByTeacherId(teacher_user_id: number): Promise<any> {
    let connection;

    try {
      connection = await pool.getConnection();

      const [subjects]: any = await connection.execute(
        `
        SELECT s.*, c.name AS class_name
        FROM subjects s
        JOIN classes c ON s.class_id = c.id
        WHERE s.teacher_id = ?;
        `,
        [teacher_user_id]
      );

      return {
        status: 1,
        message: 'Subjects fetched successfully',
        data: subjects,
      };
    } catch (error) {
      console.error('Error fetching subjects by teacher:', error);
      return {
        status: 0,
        message: 'Server error while fetching subjects',
      };
    } finally {
      if (connection) connection.release();
    }
  }
}
