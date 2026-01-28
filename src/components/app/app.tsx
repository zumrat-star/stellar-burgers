import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
// Импорты страниц
import { ConstructorPage } from '../../pages';
import { Feed } from '../../pages';
import { Login } from '../../pages';
import { Register } from '../../pages';
import { ForgotPassword } from '../../pages';
import { ResetPassword } from '../../pages';
import { Profile } from '../../pages';
import { ProfileOrders } from '../../pages';
import { NotFound404 } from '../../pages';
// Импорты компонентов
import { AppHeader } from '../app-header';
import { IngredientDetails } from '../ingredient-details';
import { Modal } from '../modal';
import { OrderInfo } from '../order-info';
import { ProtectedRoute } from '../protected-route';
// Импорты действий
import { checkUserAuth } from '../../services/slices/authSlice';

import '../../index.css';
import styles from './app.module.css';

// Страница для ингредиента (при прямом переходе)
const IngredientPage = () => (
  <div className={styles.page}>
    <h1 className='text text_type_main-large mt-10 mb-5'>Детали ингредиента</h1>
    <IngredientDetails />
  </div>
);

// Страница для заказа (при прямом переходе)
const OrderPage = () => (
  <div className={styles.page}>
    <h1 className='text text_type_main-large mt-10 mb-5'>Детали заказа</h1>
    <OrderInfo />
  </div>
);

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const background = location.state?.background;

  // Проверяем авторизацию при монтировании
  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);

  const handleModalClose = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        {/* Публичные маршруты */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        {/* Исправлено: теперь это полноценная страница */}
        <Route path='/ingredients/:id' element={<IngredientPage />} />

        {/* Защищённые маршруты */}
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        {/* Исправлено: теперь это полноценная страница */}
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          }
        />

        {/* Динамические маршруты для страниц заказов */}
        <Route path='/feed/:number' element={<OrderPage />} />

        {/* Маршрут для 404 */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Модальные окна на основе роутинга */}
      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title='Детали заказа' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title='Детали заказа' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
