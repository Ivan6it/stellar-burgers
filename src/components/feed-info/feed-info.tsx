import { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { TOrder } from '@utils-types';
import { RootState } from 'src/services/store';
import { FeedInfoUI } from '../ui/feed-info';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const orders = useSelector((state: RootState) => state.feed.orders);
  const total = useSelector((state: RootState) => state.feed.total);
  const totalToday = useSelector((state: RootState) => state.feed.totalToday);

  const readyOrders = useMemo(() => getOrders(orders, 'done'), [orders]);

  const pendingOrders = useMemo(() => getOrders(orders, 'pending'), [orders]);

  const feed = {
    total,
    totalToday
  };

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
