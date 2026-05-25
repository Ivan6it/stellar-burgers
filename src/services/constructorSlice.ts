import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

type ConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (
        state,
        action: PayloadAction<TConstructorIngredient | TIngredient>
      ) => {
        const ingredient = action.payload;

        if (ingredient.type === 'bun') {
          state.bun = { ...ingredient };
        } else {
          state.ingredients.push(ingredient as TConstructorIngredient);
        }
      },
      prepare: (ingredient: TIngredient) => {
        if (ingredient.type === 'bun') {
          return { payload: ingredient };
        } else {
          return {
            payload: {
              ...ingredient,
              id: crypto.randomUUID()
            }
          };
        }
      }
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredient(
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) {
      const { fromIndex, toIndex } = action.payload;
      const ingredient = state.ingredients[fromIndex];
      state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, ingredient);
    },
    resetConstructor() {
      return initialState;
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetConstructor
} = constructorSlice.actions;

export default constructorSlice.reducer;
