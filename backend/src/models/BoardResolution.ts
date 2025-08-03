import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Stock } from './Stock';

@Entity('board_resolutions')
export class BoardResolution {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 10 })
  @Index()
  stockSymbol!: string;

  @ManyToOne(() => Stock)
  @JoinColumn({ name: 'stockSymbol', referencedColumnName: 'symbol' })
  stock?: Stock;

  @Column({ length: 500 })
  title!: string;

  @Column({ type: 'timestamp' })
  @Index()
  resolutionDate!: Date;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'text', nullable: true })
  documentUrl?: string;

  @Column({ length: 100 })
  source!: string;

  @CreateDateColumn()
  createdAt!: Date;
}