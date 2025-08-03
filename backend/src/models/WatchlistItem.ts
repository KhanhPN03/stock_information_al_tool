import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Stock } from './Stock';

@Entity('watchlist_items')
export class WatchlistItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100, nullable: true })
  userId?: string;

  @Column({ length: 10 })
  @Index()
  stockSymbol!: string;

  @ManyToOne(() => Stock)
  @JoinColumn({ name: 'stockSymbol', referencedColumnName: 'symbol' })
  stock?: Stock;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn()
  addedDate!: Date;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;
}