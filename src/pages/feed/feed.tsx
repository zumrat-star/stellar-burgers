import { useEffect, FC, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchFeeds,
  selectFeedOrders,
  selectFeedLoading
} from '../../services/slices/feedSlice';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const isLoading = useSelector(selectFeedLoading);

  const [isManualRefresh, setIsManualRefresh] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoRefresh = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      console.log('🔄 Автообновление ленты');
      dispatch(fetchFeeds());
    }, 5000);
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchFeeds());
    startAutoRefresh();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [dispatch, startAutoRefresh]);

  const handleGetFeeds = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsManualRefresh(true);
    dispatch(fetchFeeds());

    setTimeout(() => {
      console.log('⏱️ Возвращаю автообновление');
      startAutoRefresh();
      setIsManualRefresh(false);
    }, 10000);
  };

  if (isLoading && orders.length === 0) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
