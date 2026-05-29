import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from 'src/services/store';
import {
  createOrder,
  fetchUserOrders,
  resetOrder
} from '../../services/orderSlice';
import {
  removeIngredient,
  moveIngredient,
  resetConstructor
} from '../../services/constructorSlice';
import { BurgerConstructorUI } from '@ui';
import { FC, useEffect, useMemo } from 'react';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const constructor = useSelector((state: RootState) => state.constructorSlice);
  const orderState = useSelector((state: RootState) => state.order);
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (
      orderState.loading &&
      !orderState.data &&
      !constructor.bun &&
      constructor.ingredients.length === 0
    ) {
      dispatch(resetOrder());
    }
  }, [
    dispatch,
    orderState.loading,
    orderState.data,
    constructor.bun,
    constructor.ingredients
  ]);

  const bun = constructor.bun || null;
  const ingredients = Array.isArray(constructor.ingredients)
    ? constructor.ingredients
    : [];

  const constructorItems = { bun, ingredients };

  const price = useMemo(() => {
    const bunPrice = bun ? bun.price : 0;
    const ingredientsPrice = ingredients.reduce(
      (acc, item) => acc + item.price,
      0
    );
    return bunPrice * 2 + ingredientsPrice;
  }, [bun, ingredients]);

  const isOrderDisabled =
    !bun || ingredients.length === 0 || orderState.loading;

  const onOrderClick = () => {
    if (isOrderDisabled) return;

    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    const ingredientIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];

    dispatch(createOrder(ingredientIds))
      .unwrap()
      .then(() => {
        dispatch(resetConstructor());
        dispatch(fetchUserOrders());
      })
      .catch((err) => {
        console.error('Ошибка при создании заказа:', err);
      });
  };

  const closeOrderModal = () => {
    dispatch(resetOrder());
  };

  const handleRemove = (id: string) => {
    dispatch(removeIngredient(id));
  };

  const handleMove = (fromIndex: number, toIndex: number) => {
    dispatch(moveIngredient({ fromIndex, toIndex }));
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderState.loading}
      constructorItems={constructorItems}
      orderModalData={orderState.data}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      onAdd={() => {}}
      onRemove={handleRemove}
      onMove={handleMove}
    />
  );
};
