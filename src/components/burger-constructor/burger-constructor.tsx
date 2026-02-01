import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectConstructor,
  selectTotalPrice
} from '../../services/slices/constructorSlice';
import {
  createOrder,
  selectOrderLoading,
  selectOrderModalData,
  clearOrder
} from '../../services/slices/orderSlice';
import { selectUser } from '../../services/slices/authSlice';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector(selectConstructor);
  const totalPrice = useSelector(selectTotalPrice);
  const user = useSelector(selectUser);
  const orderRequest = useSelector(selectOrderLoading);
  const orderModalData = useSelector(selectOrderModalData);

  const onOrderClick = () => {
    if (!user) {
      navigate('/login', { state: { from: '/' } });
      return;
    }

    if (!constructorItems.bun) {
      alert('Выберите булку для заказа!');
      return;
    }

    if (constructorItems.ingredients.length === 0) {
      alert('Добавьте хотя бы один ингредиент!');
      return;
    }

    const ingredientsIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientsIds));
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
