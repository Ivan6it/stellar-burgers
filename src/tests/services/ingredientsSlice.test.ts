import { describe, expect, test, beforeEach } from '@jest/globals';
import ingredientsSlice, {
  fetchIngredients as fetchIngredientsAction,
  ingredientsInitialState
} from '../../services/ingredientsSlice';

jest.mock('../../utils/burger-api', () => ({
  fetchIngredients: jest.fn()
}));

const mockIngredients = [
  {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 20,
    carbohydrates: 30,
    calories: 40,
    price: 100,
    image: 'url',
    image_mobile: 'url',
    image_large: 'url'
  }
];

let state = { ...ingredientsInitialState };

beforeEach(() => {
  state = { ...ingredientsInitialState };
  jest.clearAllMocks();
});

describe('Тесты загрузки ингредиентов', () => {
  test('pending', () => {
    const action = { type: fetchIngredientsAction.pending.type };
    const newState = ingredientsSlice(state, action);

    expect(newState.loading).toBe(true);
    expect(newState.error).toBeNull();
  });

  test('fulfilled', () => {
    const action = {
      type: fetchIngredientsAction.fulfilled.type,
      payload: mockIngredients
    };
    const newState = ingredientsSlice(state, action);

    expect(newState.loading).toBe(false);
    expect(newState.items).toEqual(mockIngredients);
    expect(newState.error).toBeNull();
  });

  test('rejected', () => {
    const error = 'Сетевая ошибка';
    const action = {
      type: fetchIngredientsAction.rejected.type,
      payload: error
    };
    const newState = ingredientsSlice(state, action);

    expect(newState.loading).toBe(false);
    expect(newState.error).toBe(error);
    expect(newState.items).toEqual([]);
  });
});
