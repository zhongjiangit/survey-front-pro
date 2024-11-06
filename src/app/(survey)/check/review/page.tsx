'use client';

import { collectDataSource } from '../testData';
import CollectListItem from './modules/collect-list-item';

interface CheckReviewProps {}

const CheckReview = () => {
  return <CollectListItem itemData={collectDataSource} />;
};

export default CheckReview;
