import { SubscriptionBlock } from '../../entity/SubscriptionBlock';
import { OrgCurrentSubscriptionInformation } from '../../entity/views/OrgCurrentSubscriptionInformation';
import { SubscriptionStartingMode } from '../../types/SubscriptionStartingMode';
import { SubscriptionBlockType } from '../../types/SubscriptionBlockType';
import { EntityManager } from 'typeorm';
import { createSubscriptionBlock } from './createSubscriptionBlock';
import { purchaseSubscriptionBlock } from './purchaseSubscriptionBlock';


export async function changeSubscription(
  m: EntityManager,
  subInfo: OrgCurrentSubscriptionInformation,
  seats: number,
  promotionCode: string,
  geoInfo: any
): Promise<SubscriptionBlock> {
  const newMonthlyBlock = createSubscriptionBlock(subInfo, SubscriptionBlockType.Monthly, SubscriptionStartingMode.Rightaway);
  newMonthlyBlock.seats = seats;
  newMonthlyBlock.promotionCode = promotionCode;
  return await purchaseSubscriptionBlock(m, subInfo, newMonthlyBlock, { geoInfo, auto: false });
}
