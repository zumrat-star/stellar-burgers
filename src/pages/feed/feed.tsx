import { useEffect, FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchFeeds,
  selectFeedOrders,
  selectFeedLoading,
  selectFeedTotal,
  selectFeedTotalToday
} from '../../services/slices/feedSlice';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const isLoading = useSelector(selectFeedLoading);
  const total = useSelector(selectFeedTotal);
  const totalToday = useSelector(selectFeedTotalToday);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  useEffect(() => {
    if (orders.length === 0) return;

    const intervalId = setInterval(() => {
      dispatch(fetchFeeds());
    }, 5000);

    return () => clearInterval(intervalId);
  }, [dispatch, orders.length]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (isLoading && orders.length === 0) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
