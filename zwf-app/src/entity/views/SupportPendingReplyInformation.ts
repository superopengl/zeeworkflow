import { SupportUserUnreadInformation } from './SupportUserUnreadInformation';
import { SupportMessage } from '../SupportMessage';
import { ViewEntity, Connection, ViewColumn, PrimaryColumn } from 'typeorm';
import { SupportUserLastAccess } from '../SupportUserLastAccess';

@ViewEntity({
  expression: (connection: Connection) => connection.createQueryBuilder()
    .from(SupportMessage, 'x')
    .innerJoin(q => q.from(SupportMessage, 'm')
      .where(`m.by != m."userId"`)
      .distinctOn(['m."userId"'])
      .orderBy('"userId"')
      .addOrderBy('"createdAt"', 'DESC')
      .select([
        `m.userId as "userId"`,
        `m."createdAt" as "lastReplyAt"`
      ]),
      'u', 'x."userId" = u."userId"')
    .where(`x."createdAt" > u."lastReplyAt"`)
    .andWhere(`x.by = x."userId"`)
    .groupBy('x."userId"')
    .select([
      'x."userId" as "userId"',
      'COUNT(1) as count',
    ])
})
export class SupportPendingReplyInformation {
  @ViewColumn()
  @PrimaryColumn()
  userId: string;

  @ViewColumn()
  count: number;
}
