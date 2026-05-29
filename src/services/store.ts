import { configureStore } from '@reduxjs/toolkit';
import userSlice from '../services/userSlice';
import ingredientsSlice from './ingredientsSlice';
import constructorSlice from './constructorSlice';
import orderSlice from './orderSlice';
import feedSlice from './feedSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const store = configureStore({
  reducer: {
    constructorSlice: constructorSlice,
    user: userSlice,
    ingredients: ingredientsSlice,
    order: orderSlice,
    feed: feedSlice
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
