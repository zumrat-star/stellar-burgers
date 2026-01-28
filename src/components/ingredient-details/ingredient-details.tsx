import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { selectIngredients } from '../../services/slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  // Получаем все ингредиенты из стора
  const ingredients = useSelector(selectIngredients);

  // Находим нужный ингредиент по ID из URL
  const ingredientData = ingredients.find((item) => item._id === id);

  // Если ингредиенты еще не загружены
  if (ingredients.length === 0) {
    return <Preloader />;
  }

  // Если ингредиент не найден
  if (!ingredientData) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p className='text text_type_main-default'>Ингредиент не найден</p>
      </div>
    );
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
