import { Injectable } from '@nestjs/common';
import { pool } from '../../../config/db'; // Make sure this path is correct
import { CreateSchoolDto } from './dto/create_school.dto';
import { CreateStaffDto } from './dto/create_staff_dto';

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


  async getSubjectsByTeacherId(userId: number, roleId: number): Promise<any> {
    let connection;
    if (roleId != 4) {
      return {
        status: 0,
        message: 'you are not authoriserd ',
      };
    }

    try {
      connection = await pool.getConnection();

      const [subjects]: any = await connection.execute(
        `
        SELECT s.*, c.name AS class_name
        FROM subjects s
        JOIN classes c ON s.class_id = c.id
        WHERE s.teacher_id = ?;
        `,
        [userId]
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

  async createSchool(schoolDto: CreateSchoolDto): Promise<any> {
    let connection;

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

    try {
      connection = await pool.getConnection();

      const query = `
      INSERT INTO schools 
      (name, code, address, phone, email, principal_name, established_year, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

      const [result]: any = await connection.execute(query, [
        name,
        code,
        address,
        phone,
        email,
        principal_name,
        established_year,
        status,
      ]);

      return {
        status: 1,
        message: 'School created successfully',
        schoolId: result.insertId,
      };
    } catch (error) {
      console.error('Create School Error:', error);
      return {
        status: 0,
        message: 'Failed to create school',
        error: error.message,
      };
    } finally {
      if (connection) connection.release();
    }
  }


  async getStudentsBySchoolId(school_id: number): Promise<any> {
    let connection;
    if (!school_id ) {
      return {
        status: 0,
        message: 'you are not authoriserd ',
      };
    }

    try {
      connection = await pool.getConnection();

      const [results]: any = await connection.execute(
        `
      SELECT 
        s.name AS school_name,
        up.full_name AS student_name,
        c.name AS class_name,
        st.roll_number,
        st.admission_date,
        up.gender,
        up.dob,
        up.phone
      FROM schools s
      JOIN students st ON s.id = st.school_id
      JOIN users u ON st.user_id = u.id
      JOIN user_profiles up ON u.id = up.user_id
      JOIN classes c ON st.class_id = c.id
        WHERE s.id = ?
        ORDER BY c.name, st.roll_number
        `,
        [school_id]
      );

      return {
        status: 1,
        message: 'Students fetched successfully',
        data: results,
      };
    } catch (error) {
      console.error('Error fetching students:', error);
      return {
        status: 0,
        message: 'Failed to fetch students',
        error: error.message,
      };
    } finally {
      if (connection) connection.release();
    }
  }


  // src/mobileapi/v1/school/school.service.ts
async getTeachersBySchoolId(school_id: number): Promise<any> {
  let connection; 

  try {
    connection = await pool.getConnection();

    const [results]: any = await connection.execute(
      `
      SELECT 
        s.name AS school_name,
        up.full_name AS teacher_name,
        r.name AS role
      FROM schools s
      JOIN users u ON s.id = u.school_id
      JOIN user_profiles up ON u.id = up.user_id
      JOIN roles r ON u.role_id = r.id
      WHERE r.name = 'Teacher' AND s.id = ?
      ORDER BY up.full_name
      `,
      [school_id]
    );

    return {
      status: 1,
      message: 'Teachers fetched successfully',
      data: results,
    };
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return {
      status: 0,
      message: 'Failed to fetch teachers',
      error: error.message,
    };
  } finally {
    if (connection) connection.release();
  }
}

async getFeeSummaryBySchool(): Promise<any> {
  let connection;

  try {
    connection = await pool.getConnection();

    const [results]: any = await connection.execute(
      `
      SELECT 
        s.name AS school_name,
        f.status,
        COUNT(*) AS count,
        SUM(f.amount) AS total_amount
      FROM schools s
      JOIN fees f ON s.id = f.school_id
      GROUP BY s.id, f.status
      ORDER BY s.name, f.status
      `
    );

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
  } finally {
    if (connection) connection.release();
  }
}


async getSubjectTeacherDetailsBySchoolId(school_id: number): Promise<any> {
  let connection;

  try {
    connection = await pool.getConnection();

    const [results]: any = await connection.execute(
      `
      SELECT 
        s.name AS school_name,
        c.name AS class_name,
        sub.name AS subject_name,
        up.full_name AS teacher_name
      FROM schools s
      JOIN classes c ON s.id = c.school_id
      JOIN subjects sub ON c.id = sub.class_id
      JOIN users u ON sub.teacher_id = u.id
      JOIN user_profiles up ON u.id = up.user_id
      WHERE s.id = ?
      ORDER BY s.name, c.name, sub.name
      `,
      [school_id]
    );

    return {
      status: 1,
      message: 'Subject-teacher details fetched successfully',
      data: results,
    };
  } catch (error) {
    console.error('Error fetching subject-teacher details:', error);
    return {
      status: 0,
      message: 'Failed to fetch subject-teacher details',
      error: error.message,
    };
  } finally {
    if (connection) connection.release();
  }
}


async createStaff(dto: CreateStaffDto): Promise<any> {
  let connection;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Insert into staff table
    const [staffResult]: any = await connection.execute(
      `
      INSERT INTO staff (
        employee_id, user_id, school_id, department, designation, joining_date,
        salary_grade, qualification, experience_years, status,
        reporting_manager_id, emergency_contact, blood_group
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        dto.employee_id,
        dto.user_id,
        dto.school_id,
        dto.department,
        dto.designation,
        dto.joining_date,
        dto.salary_grade || null,
        dto.qualification || null,
        dto.experience_years || 0,
        'active',
        dto.reporting_manager_id || null,
        dto.emergency_contact || null,
        dto.blood_group || null,
      ]
    );

    const staffId = staffResult.insertId;

    // Insert qualifications
    for (const q of dto.qualifications) {
      await connection.execute(
        `
        INSERT INTO staff_qualifications (
          staff_id, degree, institution, year_completed, percentage, certificate_path
        ) VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          staffId,
          q.degree,
          q.institution,
          q.year_completed,
          q.percentage || null,
          q.certificate_path || null,
        ]
      );
    }

    await connection.commit();
    return {
      status: 1,
      message: 'Staff created successfully',
      staff_id: staffId,

    };
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error creating staff:', error);
    return {
      status: 0,
      message: 'Failed to create staff',
      error: error.message,
    };
  } finally {
    if (connection) connection.release();
  }
}


  async getStaffBySchoolId(school_id: number): Promise<any> {
    let connection;

    try {
      connection = await pool.getConnection();

      const [rows]: any = await connection.execute(
        `
        SELECT 
          s.id as staff_id,
          s.employee_id,
          s.designation,
          s.department,
          s.joining_date,
          s.qualification,
          s.experience_years,
          s.status,
          up.full_name as staff_name,
          up.profile_picture,
          d.name as department_name,
          mgr_up.full_name as reporting_manager_name
        FROM staff s
        JOIN users u ON s.user_id = u.id
        JOIN user_profiles up ON u.id = up.user_id
        LEFT JOIN staff_departments d ON s.department = d.name AND s.school_id = d.school_id
        LEFT JOIN staff mgr ON s.reporting_manager_id = mgr.id
        LEFT JOIN users mgr_u ON mgr.user_id = mgr_u.id
        LEFT JOIN user_profiles mgr_up ON mgr_u.id = mgr_up.user_id
        WHERE s.school_id = ?
        ORDER BY s.id ASC
        `,
        [school_id],
      );

      return {
        status: 1,
        message: `Staff list for school ID ${school_id}`,
        total: rows.length,
        data: rows,
      };
    } catch (error) {
      console.error('Get Staff Error:', error);
      return {
        status: 0,
        message: 'Failed to fetch staff list',
        error: error.message,
      };
    } finally {
      if (connection) connection.release();
    }
  }


  // staff.service.ts
async getStaffDetailsByUserId(user_id: number): Promise<any> {
  let connection;

  try {
    connection = await pool.getConnection();

    // Get main staff info
    const [rows]: any = await connection.execute(
      `
      SELECT 
        s.id as staff_id,
        s.user_id,
        s.employee_id,
        s.school_id,
        sc.name as school_name,
        s.designation,
        s.department,
        s.joining_date,
        s.qualification,
        s.experience_years,
        s.salary_grade,
        s.reporting_manager_id,
        s.emergency_contact,
        s.blood_group,
        up.full_name,
        up.profile_picture,
        u.email,
        u.phone
      FROM staff s
      JOIN users u ON s.user_id = u.id
      JOIN user_profiles up ON u.id = up.user_id
      LEFT JOIN schools sc ON s.school_id = sc.id
      WHERE s.user_id = ?
      `,
      [user_id],
    );

    if (rows.length === 0) {
      return {
        status: 0,
        message: 'Staff not found for this user ID',
      };
    }

    const staff = rows[0];

    // Fetch qualifications
    const [qualifications]: any = await connection.execute(
      `
      SELECT 
        id,
        degree,
        institution,
        year_completed,
        percentage,
        certificate_path
      FROM staff_qualifications
      WHERE staff_id = ?
      `,
      [staff.staff_id]
    );

    return {
      status: 1,
      message: 'Staff details fetched successfully',
      data: {
        ...staff,
        qualifications, // added list
      },
    };
  } catch (error) {
    console.error('Get Staff By User ID Error:', error);
    return {
      status: 0,
      message: 'Failed to fetch staff details',
      error: error.message,
    };
  } finally {
    if (connection) connection.release();
  }
}



  async updateStaffByUserId(user_id: number, updateData: Partial<CreateStaffDto>): Promise<any> {
  let connection;

  try {
    connection = await pool.getConnection();

    const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);

    if (fields.length === 0) {
      return { status: 0, message: 'No fields to update' };
    }

    const [result]: any = await connection.execute(
      `UPDATE staff SET ${fields} WHERE user_id = ?`,
      [...values, user_id]
    );

    return {
      status: 1,
      message: 'Staff details updated successfully',
      affectedRows: result.affectedRows,
    };
  } catch (error) {
    console.error('Update Staff Error:', error);
    return {
      status: 0,
      message: 'Failed to update staff',
      error: error.message,
    };
  } finally {
    if (connection) connection.release();
  }
}


async getSalaryByUserId(user_id: number): Promise<any> {
  let connection;

  try {
    connection = await pool.getConnection();

    const [rows]: any = await connection.execute(
      `
      SELECT 
        s.id AS salary_id,
        s.staff_id,
        s.staff_table_id,
        st.user_id,
        s.month,
        s.year,
        s.base_salary,
        s.bonus,
        s.deductions,
        s.total_salary,
        s.school_id
      FROM salaries s
      JOIN staff st ON s.staff_table_id = st.id
      WHERE st.user_id = ?
      `,
      [user_id]
    );

    if (rows.length === 0) {
      return {
        status: 0,
        message: 'No salary records found for this user ID',
      };
    }

    return {
      status: 1,
      message: 'Salary records fetched successfully',
      data: rows,
    };
  } catch (error) {
    console.error('Get Salary By User ID Error:', error);
    return {
      status: 0,
      message: 'Failed to fetch salary details',
      error: error.message,
    };
  } finally {
    if (connection) connection.release();
  }
}


async markStaffAttendanceByUserId(user_id: number, date: string, status: string): Promise<any> {
  let connection;

  try {
    connection = await pool.getConnection();

    // 1. Get staff info from user_id
    const [staffRows]: any = await connection.execute(
      `SELECT id AS staff_id, id AS staff_table_id, school_id FROM staff WHERE user_id = ?`,
      [user_id]
    );

    if (staffRows.length === 0) {
      return { status: 0, message: 'Staff not found for the given user ID' };
    }

    const { staff_id, staff_table_id, school_id } = staffRows[0];

    // 2. Check if attendance already marked for that day
    const [attendanceRows]: any = await connection.execute(
      `SELECT id FROM staff_attendance WHERE staff_table_id = ? AND date = ?`,
      [staff_table_id, date]
    );

    if (attendanceRows.length > 0) {
      // 3. Update if already exists
      await connection.execute(
        `UPDATE staff_attendance SET status = ? WHERE staff_table_id = ? AND date = ?`,
        [status, staff_table_id, date]
      );
      return { status: 1, message: 'Attendance updated' };
    } else {
      // 4. Insert if not present
      await connection.execute(
        `INSERT INTO staff_attendance (staff_id, staff_table_id, date, status, school_id) VALUES (?, ?, ?, ?, ?)`,
        [staff_id, staff_table_id, date, status, school_id]
      );
      return { status: 1, message: 'Attendance marked successfully' };
    }
  } catch (error) {
    console.error('Attendance Error:', error);
    return { status: 0, message: 'Error managing attendance', error: error.message };
  } finally {
    if (connection) connection.release();
  }
}




async getLeavesByStaff(staffId: number, status?: string): Promise<any> {
  if (!staffId) {
    return { status: 0, message: 'Staff ID is required.' };
  }

  let connection;
  try {
    connection = await pool.getConnection();

    let query = `
      SELECT la.*, lt.name AS leave_type_name, s.full_name AS staff_name, a.full_name AS approver_name
      FROM staff_leave_applications la
      JOIN leave_types lt ON la.leave_type_id = lt.id
      JOIN staff s ON la.staff_id = s.id
      LEFT JOIN staff a ON la.approved_by = a.id
      WHERE la.staff_id = ?
    `;
    const params: any[] = [staffId];

    if (status) {
      query += ` AND la.status = ?`;
      params.push(status);
    }

    const [rows]: any = await connection.execute(query, params);

    return {
      status: 1,
      message: 'Leave applications fetched successfully.',
      leaves: rows,
    };
  } catch (error) {
    console.error('💥 Error fetching leave applications:', error);
    return {
      status: 0,
      message: 'Internal server error.',
      error: error.message,
    };
  } finally {
    if (connection) connection.release();
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

  let connection;
  try {
    connection = await pool.getConnection();

    const [rows]: any = await connection.execute(
      `
      SELECT 
          s.name as school_name,
          st.employee_id,
          up.full_name,
          st.department,
          st.designation,
          st.joining_date,
          st.experience_years,
          st.status,
          COALESCE(latest_eval.overall_grade, 'Not Evaluated') as latest_performance_grade,
          COALESCE(leave_balance.total_leaves_taken, 0) as leaves_taken_this_year,
          sal.total_salary as current_salary
      FROM schools s
      JOIN staff st ON s.id = st.school_id
      JOIN users u ON st.user_id = u.id
      JOIN user_profiles up ON u.id = up.user_id
      LEFT JOIN (
          SELECT staff_id, overall_grade, 
                 ROW_NUMBER() OVER (PARTITION BY staff_id ORDER BY finalized_on DESC) as rn
          FROM staff_performance_evaluations 
          WHERE status = 'finalized'
      ) latest_eval ON st.id = latest_eval.staff_id AND latest_eval.rn = 1
      LEFT JOIN (
          SELECT staff_id, SUM(total_days) as total_leaves_taken
          FROM staff_leave_applications 
          WHERE status = 'approved' AND YEAR(start_date) = 2024
          GROUP BY staff_id
      ) leave_balance ON st.id = leave_balance.staff_id
      LEFT JOIN salaries sal ON st.id = sal.staff_table_id AND sal.month = 'July' AND sal.year = 2024
      WHERE st.status = 'active' AND st.user_id = ?
      ORDER BY s.name, st.department, st.designation;
      `,
      [userId]
    );

    if (rows.length === 0) {
      return { status: 0, message: 'Staff dashboard data not found.' };
    }

    return {
      status: 1,
      message: 'Staff dashboard data fetched successfully.',
      data: rows[0],
    };
  } catch (error) {
    console.error('💥 Error fetching staff dashboard:', error);
    return {
      status: 0,
      message: 'Internal server error.',
      error: error.message,
    };
  } finally {
    if (connection) connection.release();
  }
}


async getSchoolDepartmentAnalytics(schoolId: number): Promise<any> {
  if (!schoolId) {
    return { status: 0, message: 'School ID is required.' };
  }

  let connection;
  try {
    connection = await pool.getConnection();

    const [rows]: any = await connection.execute(
      `
      SELECT 
          s.name AS school_name,
          st.department,
          COUNT(*) AS total_staff,
          AVG(spe.overall_score) AS avg_performance_score,
          COUNT(CASE WHEN spe.overall_grade IN ('A', 'A+') THEN 1 END) AS high_performers,
          COUNT(CASE WHEN spe.overall_grade IN ('C', 'D', 'F') THEN 1 END) AS low_performers,
          AVG(st.experience_years) AS avg_experience
      FROM schools s
      JOIN staff st ON s.id = st.school_id
      LEFT JOIN staff_performance_evaluations spe 
          ON st.id = spe.staff_id 
          AND spe.status = 'finalized' 
          AND spe.evaluation_period_end >= '2024-01-01'
      WHERE st.status = 'active'
        AND s.id = ?
      GROUP BY s.id, st.department
      ORDER BY s.name, avg_performance_score DESC;
      `,
      [schoolId]
    );

    if (rows.length === 0) {
      return { status: 0, message: 'No data found for the given school.' };
    }

    return {
      status: 1,
      message: 'School department analytics fetched successfully.',
      data: rows,
    };
  } catch (error) {
    console.error('💥 Error fetching school analytics:', error);
    return {
      status: 0,
      message: 'Internal server error.',
      error: error.message,
    };
  } finally {
    if (connection) connection.release();
  }
}


async getLeaveSummaryBySchool(schoolId: number): Promise<any> {
  if (!schoolId) {
    return { status: 0, message: 'School ID is required.' };
  }

  let connection;
  try {
    connection = await pool.getConnection();

    const [rows]: any = await connection.execute(
      `SELECT 
         s.name as school_name,
         st.department,
         lt.name as leave_type,
         COUNT(sla.id) as total_applications,
         SUM(CASE WHEN sla.status = 'approved' THEN sla.total_days ELSE 0 END) as approved_days,
         SUM(CASE WHEN sla.status = 'pending' THEN sla.total_days ELSE 0 END) as pending_days,
         AVG(CASE WHEN sla.status = 'approved' THEN sla.total_days END) as avg_leave_duration
       FROM schools s
       JOIN staff st ON s.id = st.school_id
       JOIN staff_leave_applications sla ON st.id = sla.staff_id
       JOIN leave_types lt ON sla.leave_type_id = lt.id
       WHERE YEAR(sla.start_date) = 2024
       AND s.id = ?
       GROUP BY s.id, st.department, lt.id
       ORDER BY s.name, st.department, total_applications DESC`,
      [schoolId]
    );

    return {
      status: 1,
      message: 'Leave summary by department and leave type fetched successfully.',
      data: rows
    };

  } catch (error) {
    console.error('💥 Error fetching leave summary:', error);
    return {
      status: 0,
      message: 'Internal server error.',
      error: error.message
    };
  } finally {
    if (connection) connection.release();
  }
}


async getSalaryPerformanceBySchool(schoolId: number): Promise<any> {
  if (!schoolId) {
    return { status: 0, message: 'School ID is required.' };
  }

  let connection;
  try {
    connection = await pool.getConnection();

    const [rows]: any = await connection.execute(
      `SELECT 
         s.name as school_name,
         st.department,
         st.designation,
         up.full_name,
         sal.total_salary,
         COALESCE(spe.overall_score, 0) as performance_score,
         COALESCE(spe.overall_grade, 'N/A') as performance_grade,
         CASE 
             WHEN sal.total_salary > dept_avg.avg_salary THEN 'Above Average'
             WHEN sal.total_salary < dept_avg.avg_salary THEN 'Below Average'
             ELSE 'Average'
         END as salary_position
       FROM schools s
       JOIN staff st ON s.id = st.school_id
       JOIN user_profiles up ON st.user_id = up.user_id
       LEFT JOIN salaries sal ON st.id = sal.staff_table_id AND sal.month = 'July' AND sal.year = 2024
       LEFT JOIN staff_performance_evaluations spe ON st.id = spe.staff_id 
           AND spe.status = 'finalized' 
           AND spe.evaluation_period_end >= '2024-01-01'
       LEFT JOIN (
           SELECT st2.school_id, st2.department, AVG(sal2.total_salary) as avg_salary
           FROM staff st2
           JOIN salaries sal2 ON st2.id = sal2.staff_table_id 
           WHERE sal2.month = 'July' AND sal2.year = 2024
           GROUP BY st2.school_id, st2.department
       ) dept_avg ON st.school_id = dept_avg.school_id AND st.department = dept_avg.department
       WHERE st.status = 'active' AND s.id = ?
       ORDER BY s.name, st.department, sal.total_salary DESC`,
      [schoolId]
    );

    return {
      status: 1,
      message: 'Salary and performance data fetched successfully.',
      data: rows
    };

  } catch (error) {
    console.error('💥 Error fetching salary-performance summary:', error);
    return {
      status: 0,
      message: 'Internal server error.',
      error: error.message
    };
  } finally {
    if (connection) connection.release();
  }
}


async getAttendancePerformanceBySchool(schoolId: number): Promise<any> {
  if (!schoolId) {
    return { status: 0, message: 'School ID is required.' };
  }

  let connection;
  try {
    connection = await pool.getConnection();

    const [rows]: any = await connection.execute(
      `SELECT 
         s.name AS school_name,
         up.full_name,
         st.department,
         COUNT(sa.id) AS total_attendance_records,
         SUM(CASE WHEN sa.status = 'present' THEN 1 ELSE 0 END) AS present_days,
         ROUND((SUM(CASE WHEN sa.status = 'present' THEN 1 ELSE 0 END) / COUNT(sa.id)) * 100, 2) AS attendance_percentage,
         COALESCE(spe.overall_score, 0) AS performance_score,
         COALESCE(spe.overall_grade, 'N/A') AS performance_grade
       FROM schools s
       JOIN staff st ON s.id = st.school_id
       JOIN user_profiles up ON st.user_id = up.user_id
       LEFT JOIN staff_attendance sa ON st.user_id = sa.staff_id AND sa.school_id = st.school_id
       LEFT JOIN staff_performance_evaluations spe ON st.id = spe.staff_id 
         AND spe.status = 'finalized' 
         AND spe.evaluation_period_end >= '2024-01-01'
       WHERE st.status = 'active' AND s.id = ?
       GROUP BY s.id, s.name, st.id, st.department, up.full_name, spe.overall_score, spe.overall_grade
       HAVING total_attendance_records > 0
       ORDER BY s.name, attendance_percentage DESC`,
      [schoolId]
    );

    return {
      status: 1,
      message: 'Staff attendance and performance fetched successfully.',
      data: rows
    };
  } catch (error) {
    console.error('💥 Error in attendance-performance summary:', error);
    return {
      status: 0,
      message: 'Internal server error.',
      error: error.message
    };
  } finally {
    if (connection) connection.release();
  }
}


async getBudgetUtilizationBySchool(schoolId: number): Promise<any> {
  if (!schoolId) {
    return { status: 0, message: 'School ID is required.' };
  }

  let connection;
  try {
    connection = await pool.getConnection();

    const [rows]: any = await connection.execute(
      `SELECT 
         s.name AS school_name,
         sd.name AS department_name,
         sd.budget AS allocated_budget,
         COUNT(st.id) AS staff_count,
         SUM(sal.total_salary) AS monthly_salary_cost,
         (SUM(sal.total_salary) * 12) AS annual_salary_cost,
         sd.budget - (SUM(sal.total_salary) * 12) AS budget_remaining,
         ROUND(((SUM(sal.total_salary) * 12) / sd.budget) * 100, 2) AS budget_utilization_percentage
       FROM schools s
       JOIN staff_departments sd ON s.id = sd.school_id
       LEFT JOIN staff st ON sd.school_id = st.school_id AND sd.name = st.department AND st.status = 'active'
       LEFT JOIN salaries sal ON st.id = sal.staff_table_id AND sal.month = 'July' AND sal.year = 2024
       WHERE s.id = ?
       GROUP BY s.id, sd.id
       ORDER BY s.name, budget_utilization_percentage DESC`,
      [schoolId]
    );

    return {
      status: 1,
      message: 'Budget utilization fetched successfully.',
      data: rows
    };
  } catch (error) {
    console.error('💥 Error fetching budget utilization:', error);
    return {
      status: 0,
      message: 'Internal server error.',
      error: error.message
    };
  } finally {
    if (connection) connection.release();
  }
}


async getTrainingPriorityBySchool(schoolId: number): Promise<any> {
  if (!schoolId) {
    return { status: 0, message: 'School ID is required.' };
  }

  let connection;
  try {
    connection = await pool.getConnection();

    const [rows]: any = await connection.execute(
      `SELECT 
         s.name AS school_name,
         st.department,
         up.full_name,
         st.experience_years,
         COALESCE(spe.overall_score, 0) AS performance_score,
         spe.areas_for_improvement,
         spe.goals_for_next_period,
         CASE 
           WHEN st.experience_years < 2 AND COALESCE(spe.overall_score, 0) < 7 THEN 'High Priority Training'
           WHEN st.experience_years < 5 AND COALESCE(spe.overall_score, 0) < 8 THEN 'Medium Priority Training'
           WHEN COALESCE(spe.overall_score, 0) < 6 THEN 'Performance Improvement Required'
           ELSE 'Standard Development'
         END AS training_priority
       FROM schools s
       JOIN staff st ON s.id = st.school_id
       JOIN user_profiles up ON st.user_id = up.user_id
       LEFT JOIN staff_performance_evaluations spe ON st.id = spe.staff_id 
         AND spe.status = 'finalized' 
         AND spe.evaluation_period_end >= '2024-01-01'
       WHERE st.status = 'active' AND s.id = ?
       ORDER BY s.name,
         CASE 
           WHEN st.experience_years < 2 AND COALESCE(spe.overall_score, 0) < 7 THEN 1
           WHEN COALESCE(spe.overall_score, 0) < 6 THEN 2
           WHEN st.experience_years < 5 AND COALESCE(spe.overall_score, 0) < 8 THEN 3
           ELSE 4
         END`,
      [schoolId]
    );

    return {
      status: 1,
      message: 'Training priority report fetched successfully.',
      data: rows
    };
  } catch (error) {
    console.error('Error fetching training priority report:', error);
    return {
      status: 0,
      message: 'Internal server error.',
      error: error.message
    };
  } finally {
    if (connection) connection.release();
  }
}


async getStaffSummaryBySchool(schoolId: number): Promise<any> {
  if (!schoolId) {
    return { status: 0, message: 'School ID is required' };
  }

  let connection;
  try {
    connection = await pool.getConnection();

    const [rows] = await connection.execute(
      `SELECT 
         s.name as school_name,
         st.department,
         COUNT(*) as total_staff,
         COUNT(CASE WHEN st.status = 'active' THEN 1 END) as active_staff,
         COUNT(CASE WHEN st.status = 'terminated' THEN 1 END) as terminated_staff,
         COUNT(CASE WHEN st.joining_date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) THEN 1 END) as new_joiners_last_year,
         AVG(st.experience_years) as avg_experience,
         AVG(DATEDIFF(CURDATE(), st.joining_date) / 365.25) as avg_tenure_years
       FROM schools s
       JOIN staff st ON s.id = st.school_id
       WHERE s.id = ?
       GROUP BY s.id, st.department
       ORDER BY s.name, st.department`,
      [schoolId]
    );

    return {
      status: 1,
      message: 'Staff department summary fetched successfully.',
      data: rows
    };
  } catch (error) {
    console.error('Error in getStaffSummaryBySchool:', error);
    return {
      status: 0,
      message: 'Internal server error.',
      error: error.message
    };
  } finally {
    if (connection) connection.release();
  }
}



}
