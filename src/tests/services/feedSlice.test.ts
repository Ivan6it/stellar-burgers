import { describe, expect, test } from '@jest/globals';
import { feedSlice } from '../../services/feedSlice';

const { reducer, actions } = feedSlice;
const { setFeedData } = actions;

const mockOrders = [
  {
    _id: '64d2b1e9f9b2a7c8f4e5d6a1',
    status: 'done',
    name: 'Краторный бургер',
    createdAt: '2023-08-08T12:00:00.000Z',
    updatedAt: '2023-08-08T12:05:00.000Z',
    number: 12345,
    ingredients: ['60d3b41abdacab0026a733c6', '60d3b41abdacab0026a733c7']
  }
];

const mockPayload = {
  orders: mockOrders,
  total: 100,
  totalToday: 10
};

describe('Тесты ленты заказов', () => {
  test('должен установить данные ленты заказов', () => {
    const initialState = {
      orders: [],
      total: 0,
      totalToday: 0
    };

    const state = reducer(initialState, setFeedData(mockPayload));

    expect(state.orders).toEqual(mockOrders);
    expect(state.total).toBe(100);
    expect(state.totalToday).toBe(10);
  });

  test('должен перезаписывать состояние при повторном вызове', () => {
    const state1 = reducer(undefined, setFeedData(mockPayload));
    const newState = reducer(
      state1,
      setFeedData({ ...mockPayload, total: 200 })
    );

    expect(newState.total).toBe(200);
    expect(newState.orders).toHaveLength(1);
  });
});
