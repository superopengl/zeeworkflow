import { getConnection, QueryRunner } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { getUtcNow } from './getUtcNow';
import * as moment from 'moment';
import { Subscription } from '../entity/Subscription';
import { SubscriptionType } from '../types/SubscriptionType';
import { SubscriptionStatus } from '../types/SubscriptionStatus';
import { CreditTransaction } from '../entity/CreditTransaction';
import { getNewSubscriptionPaymentInfo } from './getNewSubscriptionPaymentInfo';
import { PaymentStatus } from '../types/PaymentStatus';
import { Payment } from '../entity/Payment';
import { assert } from './assert';
import { OrgAliveSubscription } from '../entity/views/OrgAliveSubscription';
import { getRequestGeoInfo } from './getIpGeoLocation';

export type ProvisionSubscriptionRequest = {
  orgId: string;
  seats: number;
  promotionCode: string;
};

async function getSubscriptionPeriod(q: QueryRunner, orgId: string): Promise<{ start: Date, end: Date }> {
  const aliveSubscription = await q.manager.getRepository(OrgAliveSubscription)
    .findOne({
      orgId
    });

  const start = aliveSubscription ? moment(aliveSubscription.end).add(1, 'day').toDate() : getUtcNow();
  const end = moment(start).add(1, 'month').add(-1, 'day').toDate();
  return { start, end };
}

export async function provisionSubscriptionPurchase(request: ProvisionSubscriptionRequest, expressReq: any): Promise<Payment> {
  const { orgId, seats, promotionCode } = request;
  let payment: Payment = null;

  const tran = getConnection().createQueryRunner();
  try {
    tran.startTransaction();

    const { start, end } = await getSubscriptionPeriod(tran, orgId);

    const { creditBalance, price } = await getNewSubscriptionPaymentInfo(tran.manager, orgId, seats, promotionCode);

    const subscription = new Subscription();
    subscription.id = uuidv4();
    subscription.orgId = orgId;
    subscription.type = SubscriptionType.Montly;
    subscription.start = start;
    subscription.end = end;
    subscription.recurring = true;
    subscription.status = SubscriptionStatus.Provisioning;
    await tran.manager.save(subscription);

    const creditTransaction = new CreditTransaction();
    assert(price <= creditBalance, 400, 'No enough credit balance');
    creditTransaction.orgId = orgId;
    creditTransaction.amount = -1 * price;
    creditTransaction.type = 'user-pay';
    await tran.manager.save(creditTransaction);

    const paymentId = uuidv4();
    payment = new Payment();
    payment.id = paymentId;
    payment.orgId = orgId;
    payment.start = start;
    payment.end = end;
    payment.paidAt = null;
    payment.amount = price;
    payment.status = PaymentStatus.Pending;
    payment.auto = false;
    payment.geo = await getRequestGeoInfo(expressReq);
    payment.creditTransaction = creditTransaction;
    payment.subscription = subscription;

    await tran.manager.save(payment);

    tran.commitTransaction();
  } catch (err) {
    tran.rollbackTransaction();
    assert(false, 500, `Failed to provisoin subscription purchase: ${err.message}`);
  }

  return payment;
}




