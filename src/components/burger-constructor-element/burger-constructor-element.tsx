import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems, onMove, onRemove }) => {
    const handleMoveDown = () => {
      if (index < totalItems - 1) {
        onMove(index, index + 1);
      }
    };

    const handleMoveUp = () => {
      if (index > 0) {
        onMove(index, index - 1);
      }
    };

    const handleClose = () => {
      onRemove(ingredient.id);
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
