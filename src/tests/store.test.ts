import { describe, expect, test } from '@jest/globals';
import store from '../services/store';

describe('Проверка инициализации', () => {
  test('должен корректно инициализировать начальное состояние всех слайсов', () => {
    const state = store.getState();

    // constructorSlice
    expect(state.constructorSlice.bun).toBeNull();
    expect(state.constructorSlice.ingredients).toEqual([]);

    // userSlice
    expect(state.user.isAuthChecked).toBe(false);
    expect(state.user.user).toBeNull();
    expect(state.user.error).toBeNull();

    // ingredientsSlice
    expect(state.ingredients.loading).toBe(false);
    expect(state.ingredients.items).toEqual([]);
    expect(state.ingredients.error).toBeNull();

    // orderSlice
    expect(state.order.loading).toBe(false);
    expect(state.order.data).toBeNull();
    expect(state.order.error).toBeNull();
    expect(state.order.orders).toEqual([]);

    // feedSlice
    expect(state.feed.orders).toEqual([]);
    expect(state.feed.total).toBe(0);
    expect(state.feed.totalToday).toBe(0);
  });

  test('должен сохранять состояние при неизвестном экшене', () => {
    const previousState = store.getState();
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    store.dispatch(unknownAction);

    const currentState = store.getState();

    expect(currentState).toEqual(previousState);
  });
});
