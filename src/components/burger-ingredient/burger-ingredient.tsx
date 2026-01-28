import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { addBun, addIngredient } from '../../services/slices/constructorSlice';
import {
  selectConstructorIngredients,
  selectConstructorBun
} from '../../services/slices/constructorSlice';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const constructorIngredients = useSelector(selectConstructorIngredients);
    const constructorBun = useSelector(selectConstructorBun);

    // Функция для подсчёта количества ингредиентов в конструкторе
    const getIngredientCount = () => {
      if (ingredient.type === 'bun') {
        return constructorBun?._id === ingredient._id ? 2 : 0;
      }

      return constructorIngredients.filter(
        (item) => item._id === ingredient._id
      ).length;
    };

    const handleAdd = () => {
      if (ingredient.type === 'bun') {
        dispatch(addBun(ingredient));
      } else {
        dispatch(addIngredient(ingredient));
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={getIngredientCount()}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
