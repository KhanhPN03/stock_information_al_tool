import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('stocks')
export class Stock {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, length: 10 })
  @Index()
  symbol!: string;

  @Column({ length: 255 })
  name!: string;

  @Column({
    type: 'enum',
    enum: ['restricted', 'suspended', 'normal'],
    default: 'normal'
  })
  @Index()
  status!: 'restricted' | 'suspended' | 'normal';

  @Column({
    type: 'enum',
    enum: ['HNX', 'HOSE', 'UPCOM'],
    default: 'HNX'
  })
  exchange!: 'HNX' | 'HOSE' | 'UPCOM';

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  currentPrice?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  priceChange?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  priceChangePercent?: number;

  @Column({ type: 'bigint', nullable: true })
  volume?: number;

  @Column({ type: 'bigint', nullable: true })
  marketCap?: number;

  @Column({ type: 'text', nullable: true })
  restrictionReason?: string;

  @Column({ type: 'timestamp', nullable: true })
  restrictionDate?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Index()
  lastUpdated!: Date;
}