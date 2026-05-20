import { FC, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../services/store';
import { getFeedsApi } from '../../utils/burger-api';
import { feedSlice } from '../../services/feedSlice';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

export const Feed: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const orders = useSelector((state: RootState) => state.feed.orders);

  const handleGetFeeds = useCallback(() => {
    getFeedsApi()
      .then((data) => {
        dispatch(feedSlice.actions.setFeedData(data));
      })
      .catch((err) => {
        console.error('Ошибка при обновлении ленты:', err);
      });
  }, [dispatch]);

  useEffect(() => {
    handleGetFeeds();
  }, [handleGetFeeds]);

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
