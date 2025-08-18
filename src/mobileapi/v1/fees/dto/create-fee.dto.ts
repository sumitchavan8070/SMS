export class CreateFeeDto {
  school_id: number;
  student_id: number;
  fee_type: string;
  amount: number;
  due_date: string;
  status: 'paid' | 'unpaid' | 'overdue';
  term: string;
}