import { TConstructorIngredient } from '@utils-types';

export type BurgerConstructorElementProps = {
  ingredient: TConstructorIngredient;
  index: number;
  totalItems: number;
  onRemove: (id: string) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
};
