import { useEffect, FC } from 'react';
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

  // Загружаем только после проверки авторизации и если пользователь авторизован
  useEffect(() => {
    if (isAuthChecked && user) {
      dispatch(fetchProfileOrders());
    }
  }, [dispatch, user, isAuthChecked]);

  // Обновляем каждые 10 секунд, только если пользователь авторизован И есть заказы
  useEffect(() => {
    if (!user || orders.length === 0) return;

    const intervalId = setInterval(() => {
      dispatch(fetchProfileOrders());
    }, 10000);

    return () => clearInterval(intervalId);
  }, [dispatch, user, orders.length]);

  // Если не авторизован - перенаправляем на логин
  useEffect(() => {
    if (isAuthChecked && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, isAuthChecked, navigate]);

  // Пока проверяем авторизацию
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Пока загружаем данные (первая загрузка)
  if (isLoading && orders.length === 0) {
    return <Preloader />;
  }

  // Если ошибка
  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p className='text text_type_main-default text_color_error'>
          Ошибка загрузки истории заказов: {error}
        </p>
        <button
          className='text text_type_main-default mt-4'
          onClick={() => dispatch(fetchProfileOrders())}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return <ProfileOrdersUI orders={orders} />;
};
