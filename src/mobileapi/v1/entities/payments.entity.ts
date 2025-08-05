import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Fees } from "./fees.entity";

@Index("fee_id", ["feeId"], {})
@Entity("payments", { schema: "sms" })
export class Payments {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "fee_id", nullable: true })
  feeId: number | null;

  @Column("float", { name: "amount", nullable: true, precision: 12 })
  amount: number | null;

  @Column("date", { name: "date_paid", nullable: true })
  datePaid: string | null;

  @Column("enum", {
    name: "method",
    nullable: true,
    enum: ["cash", "card", "upi"],
  })
  method: "cash" | "card" | "upi" | null;

  @Column("varchar", { name: "reference_no", nullable: true, length: 255 })
  referenceNo: string | null;

  @ManyToOne(() => Fees, (fees) => fees.payments, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "fee_id", referencedColumnName: "id" }])
  fee: Fees;
}
