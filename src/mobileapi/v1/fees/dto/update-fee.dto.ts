


// dto/update-fee.dto.ts
export class UpdateFeeDto {
  fee_type?: string;
  amount?: number;
  due_date?: string;
  status?: 'paid' | 'unpaid' | 'overdue';
  term?: string;
}