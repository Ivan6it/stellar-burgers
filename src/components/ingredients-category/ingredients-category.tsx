import { forwardRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/services/store';
import { TIngredientsCategoryProps } from './type';
import { IngredientsCategoryUI } from '../ui/ingredients-category';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients, handleAdd }, ref) => {
  const constructor = useSelector((state: RootState) => state.constructorSlice);

  const safeIngredients = Array.isArray(constructor.ingredients)
    ? constructor.ingredients
    : [];

  const bun = constructor.bun;

  const ingredientsCounters = useMemo(() => {
    const counters: { [key: string]: number } = {};

    safeIngredients.forEach((ingredient) => {
      counters[ingredient._id] = (counters[ingredient._id] || 0) + 1;
    });

    if (bun) {
      counters[bun._id] = 2;
    }

    return counters;
  }, [safeIngredients, bun]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
      handleAdd={handleAdd}
    />
  );
});
