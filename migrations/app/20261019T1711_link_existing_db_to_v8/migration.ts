#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/aa5c71db5eb3362e1aed95dee1dc9f8ce5c4f15a8af236333abc0023372d2b23/contract';
import endContract from '../../snapshots/aa5c71db5eb3362e1aed95dee1dc9f8ce5c4f15a8af236333abc0023372d2b23/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/cab1462156e2320c91d1a82ef70c87652d359f23df019c208e12865a5a71a4b9/contract';
import startContract from '../../snapshots/cab1462156e2320c91d1a82ef70c87652d359f23df019c208e12865a5a71a4b9/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'users',
        column: col('role', 'text', {
          notNull: true,
          default: lit('USER'),
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'users',
        column: col('status', 'text', {
          notNull: true,
          default: lit('ACTIVE'),
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'users',
        constraint: 'users_role_check_5b1978b5',
        expression: `"role" IN ('ADMIN', 'USER')`,
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'users',
        constraint: 'users_status_check_ee520df2',
        expression: `"status" IN ('ACTIVE', 'INACTIVE')`,
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
