import { describe, expect, test, beforeEach } from '@jest/globals';
import constructorSlice, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  constructorInitialState,
  resetConstructor
} from '../../services/constructorSlice';

const bun = {
  _id: '60d3b41abdacab0026a733c6',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

const ingredient = {
  _id: '60d3b41abdacab0026a733c7',
  name: 'Мясо бессмертных моллюсков Protostomia',
  type: 'main',
  proteins: 433,
  fat: 244,
  carbohydrates: 33,
  calories: 420,
  price: 1337,
  image: 'https://code.s3.yandex.net/react/code/meat-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-02-large.png'
};

let state = { ...constructorInitialState };

beforeEach(() => {
  state = { ...constructorInitialState };
});

describe('Тесты логики конструктора', () => {
  test('добавление булки', () => {
    const action = addIngredient(bun);
    const newState = constructorSlice(state, action);

    expect(newState.bun).toEqual(bun);
  });

  test('добавление начинки', () => {
    const action = addIngredient(ingredient);
    const newState = constructorSlice(state, action);

    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients[0]).toMatchObject({
      _id: ingredient._id,
      name: ingredient.name,
      id: expect.any(String)
    });
  });

  test('удаление начинки', () => {
    const add = addIngredient(ingredient);
    const addedState = constructorSlice(state, add);

    const remove = removeIngredient(addedState.ingredients[0].id);
    const newState = constructorSlice(addedState, remove);

    expect(newState.ingredients).toHaveLength(0);
  });

  test('перемещение начинок', () => {
    const ing1 = { ...ingredient, _id: '1', name: 'Ингредиент 1' };
    const ing2 = { ...ingredient, _id: '2', name: 'Ингредиент 2' };

    let intermediateState = constructorSlice(state, addIngredient(ing1));
    intermediateState = constructorSlice(
      intermediateState,
      addIngredient(ing2)
    );

    const move = moveIngredient({ fromIndex: 1, toIndex: 0 });
    const newState = constructorSlice(intermediateState, move);

    expect(newState.ingredients[0].name).toBe('Ингредиент 2');
    expect(newState.ingredients[1].name).toBe('Ингредиент 1');
  });
  test('сброс конструктора', () => {
    let newState = constructorSlice(state, addIngredient(bun));
    newState = constructorSlice(newState, addIngredient(ingredient));

    expect(newState.bun).toEqual(bun);
    expect(newState.ingredients).toHaveLength(1);

    const resetState = constructorSlice(newState, resetConstructor());

    expect(resetState).toEqual(constructorInitialState);
  });
});
