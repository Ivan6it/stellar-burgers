import { TIngredient } from '@utils-types';

export type TBurgerIngredientProps = {
  ingredient: TIngredient;
  count: number;
  handleAdd: (ingredient: TIngredient) => void;
};
