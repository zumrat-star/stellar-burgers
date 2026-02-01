import { useEffect, FC, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  fetchProfileOrders,
  selectProfileOrders,
  selectProfileOrdersLoading,
  selectProfileOrdersError
} from '../../services/slices/profileOrdersSlice';
import {
  selectUser,
  selectIsAuthChecked
} from '../../services/slices/authSlice';
import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const orders = useSelector(selectProfileOrders);
  const isLoading = useSelector(selectProfileOrdersLoading);
  const error = useSelector(selectProfileOrdersError);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoRefresh = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      console.log('🔄 [ProfileOrders] Автообновление истории');
      dispatch(fetchProfileOrders());
    }, 10000);
  }, [dispatch]);

  useEffect(() => {
    if (isAuthChecked && user) {
      dispatch(fetchProfileOrders());
      startAutoRefresh();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [dispatch, user, isAuthChecked, startAutoRefresh]);

  const handleRefreshOrders = () => {
    console.log('🟢 [ProfileOrders] Ручное обновление истории');

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    dispatch(fetchProfileOrders());

    setTimeout(() => {
      console.log('⏱️ [ProfileOrders] Возвращаю автообновление');
      startAutoRefresh();
    }, 15000);
  };

  useEffect(() => {
    if (isAuthChecked && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, isAuthChecked, navigate]);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (isLoading && orders.length === 0) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p className='text text_type_main-default text_color_error'>
          Ошибка загрузки истории заказов: {error}
        </p>
        <button
          className='text text_type_main-default mt-4'
          onClick={handleRefreshOrders}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return <ProfileOrdersUI orders={orders} />;
};
