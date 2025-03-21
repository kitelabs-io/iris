import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Dex } from '../../constants';
import { Asset } from './Asset';
import { LiquidityPoolState } from './LiquidityPoolState';

@Entity({ name: 'liquidity_pools' })
export class LiquidityPool extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dex: string;

  @Column({ unique: true })
  identifier: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  orderAddress: string;

  @OneToOne(() => Asset, { nullable: true })
  @JoinColumn()
  tokenA: Relation<Asset | undefined>;

  @OneToOne(() => Asset)
  @JoinColumn()
  tokenB: Relation<Asset>;

  @Column({ type: 'bigint', unsigned: true })
  createdSlot: number;

  @Column({ nullable: true })
  meta: string;

  @OneToOne(() => LiquidityPoolState)
  @JoinColumn()
  latestState: Relation<LiquidityPoolState>;

  @OneToMany(
    () => LiquidityPoolState,
    (state: LiquidityPoolState) => state.liquidityPool
  )
  @JoinColumn()
  states: Relation<LiquidityPoolState>[];

  static make(
    dex: Dex,
    identifier: string,
    address: string,
    tokenA: Asset | undefined,
    tokenB: Asset,
    createdSlot: number
  ): LiquidityPool {
    let pool: LiquidityPool = new LiquidityPool();

    pool.dex = dex;
    pool.identifier = identifier;
    pool.address = address;
    pool.tokenA = tokenA;
    pool.tokenB = tokenB;
    pool.createdSlot = createdSlot;

    return pool;
  }
}
