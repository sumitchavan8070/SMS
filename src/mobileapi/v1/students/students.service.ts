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
}
    