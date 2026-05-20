import { FC, useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { TIngredient, TOrder } from '@utils-types';
import { RootState } from 'src/services/store';
import { getOrderByNumberApi } from '../../utils/burger-api';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const orderNumber = Number(number);

  const ingredients = useSelector(
    (state: RootState) => state.ingredients.items
  );

  const userOrders = useSelector((state: RootState) => state.order.orders);
  const feedOrders = useSelector(
    (state: RootState) => state.feed?.orders || []
  );

  const order =
    userOrders.find((o: TOrder) => o.number === orderNumber) ||
    feedOrders.find((o: TOrder) => o.number === orderNumber);

  const [currentOrder, setCurrentOrder] = useState<TOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (order) {
      setCurrentOrder(order);
      setLoading(false);
    } else {
      getOrderByNumberApi(orderNumber)
        .then((data) => {
          setCurrentOrder(data.orders[0]);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Ошибка загрузки заказа:', err);
          setLoading(false);
        });
    }
  }, [order, orderNumber]);

  const orderInfo = useMemo(() => {
    if (!currentOrder || !ingredients.length) return null;

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = currentOrder.ingredients.reduce(
      (acc: TIngredientsWithCount, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = { ...ingredient, count: 1 };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc: number, item: TIngredient & { count: number }) =>
        acc + item.price * item.count,
      0
    );

    const date = new Date(currentOrder.createdAt);

    return {
      ...currentOrder,
      ingredientsInfo,
      date,
      total
    };
  }, [currentOrder, ingredients]);

  if (loading) return <Preloader />;
  if (!orderInfo) return null;

  return <OrderInfoUI orderInfo={orderInfo} />;
};
