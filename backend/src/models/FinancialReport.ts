import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Stock } from './Stock';

@Entity('financial_reports')
export class FinancialReport {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 10 })
  @Index()
  stockSymbol!: string;

  @ManyToOne(() => Stock)
  @JoinColumn({ name: 'stockSymbol', referencedColumnName: 'symbol' })
  stock?: Stock;

  @Column({
    type: 'enum',
    enum: ['quarterly', 'annual', 'extraordinary']
  })
  reportType!: 'quarterly' | 'annual' | 'extraordinary';

  @Column({ type: 'int' })
  @Index()
  year!: number;

  @Column({ type: 'int', nullable: true })
  quarter?: number;

  @Column({ type: 'bigint', nullable: true })
  revenue?: number;

  @Column({ type: 'bigint', nullable: true })
  profit?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  eps?: number;

  @Column({ type: 'text', nullable: true })
  reportUrl?: string;

  @Column({ type: 'timestamp' })
  @Index()
  publishDate!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}