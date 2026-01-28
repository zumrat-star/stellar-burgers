import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../services/store';
import { selectUser, selectIsAuthChecked } from '../services/slices/authSlice';

interface ProtectedRouteProps {
  children: ReactElement;
  onlyUnAuth?: boolean;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  onlyUnAuth = false
}) => {
  const location = useLocation();
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  // Пока проверяем авторизацию, ничего не рендерим
  if (!isAuthChecked) {
    return null;
  }

  // Если пользователя нет и маршрут защищён
  if (!user && !onlyUnAuth) {
    // Сохраняем путь, куда пытался попасть пользователь
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // Если пользователь авторизован, но пытается попасть на маршруты только для неавторизованных
  if (user && onlyUnAuth) {
    // Перенаправляем откуда пришёл или на главную
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }
  return children;
};
