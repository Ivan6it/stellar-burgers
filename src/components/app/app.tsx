import { ConstructorPage, NotFound404, Login } from '@pages';
import '../../index.css';
import { Preloader } from '../ui/preloader';
import styles from './app.module.css';
import Layout from '../Layout';
import { ProfileOrders } from '../../pages/profile-orders/profile-orders';
import { Profile } from '../../pages/profile/profile';
import { ResetPassword } from '../../pages/reset-password/reset-password';
import { ForgotPassword } from '../../pages/forgot-password/forgot-password';
import { Register } from '../../pages/register/register';
import { Feed } from '../../pages/feed/feed';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../protected-route/protected-route';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/services/store';
import { useEffect } from 'react';
import { fetchIngredients } from '../../services/ingredientsSlice';
import { Modal } from '../modal';
import { IngredientDetails } from '../ingredient-details';
import { checkUserAuth } from '../../services/userSlice';
import { OrderInfo } from '../order-info/order-info';

const App = () => {
  const {
    items: ingredients,
    loading: isIngredientsLoading,
    error
  } = useSelector((state: RootState) => state.ingredients);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(checkUserAuth());
  }, [dispatch]);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: isIngredientsLoading ? (
            <Preloader />
          ) : error ? (
            <div className={`${styles.error} text text_type_main-medium pt-4`}>
              {error}
            </div>
          ) : ingredients.length === 0 ? (
            <div className={`${styles.title} text text_type_main-medium pt-4`}>
              Нет игредиентов
            </div>
          ) : (
            <ConstructorPage />
          )
        },
        { path: 'feed', element: <Feed /> },

        // Гость
        {
          path: 'login',
          element: (
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          )
        },
        {
          path: 'register',
          element: (
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          )
        },
        {
          path: 'forgot-password',
          element: (
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          )
        },
        {
          path: 'reset-password',
          element: (
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          )
        },

        // Пользователь
        {
          path: 'profile',
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          )
        },
        {
          path: 'profile/orders',
          element: (
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          )
        },

        //Модалки
        {
          path: 'ingredients/:id',
          element: (
            <Modal
              title='Детали ингредиента'
              onClose={() => window.history.back()}
            >
              <IngredientDetails />
            </Modal>
          )
        },
        {
          path: 'feed/:number',
          element: (
            <Modal title='Детали заказа' onClose={() => window.history.back()}>
              <OrderInfo />
            </Modal>
          )
        },
        {
          path: 'profile/orders/:number',
          element: (
            <ProtectedRoute>
              <Modal
                title='Детали заказа'
                onClose={() => window.history.back()}
              >
                <OrderInfo />
              </Modal>
            </ProtectedRoute>
          )
        },

        { path: '*', element: <NotFound404 /> }
      ]
    }
  ]);

  return <RouterProvider router={router} />;
};

export default App;
