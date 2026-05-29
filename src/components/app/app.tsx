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
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from '../protected-route/protected-route';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/services/store';
import { useEffect } from 'react';
import { fetchIngredients } from '../../services/ingredientsSlice';
import { checkUserAuth } from '../../services/userSlice';
import { Modal } from '../modal';
import { IngredientDetails } from '../ingredient-details';
import { OrderInfo } from '../order-info/order-info';

const App = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

const AppContent = () => {
  const location = useLocation();
  const background = location.state?.background;

  const {
    items: ingredients,
    loading: isIngredientsLoading,
    error
  } = useSelector((state: RootState) => state.ingredients);

  return (
    <>
      <Routes location={background || location}>
        <Route path='/' element={<Layout />}>
          <Route
            index
            element={
              isIngredientsLoading ? (
                <Preloader />
              ) : error ? (
                <div
                  className={`${styles.error} text text_type_main-medium pt-4`}
                >
                  {error}
                </div>
              ) : ingredients.length === 0 ? (
                <div
                  className={`${styles.title} text text_type_main-medium pt-4`}
                >
                  Нет ингредиентов
                </div>
              ) : (
                <ConstructorPage />
              )
            }
          />

          <Route
            path='login'
            element={
              <ProtectedRoute onlyUnAuth>
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path='register'
            element={
              <ProtectedRoute onlyUnAuth>
                <Register />
              </ProtectedRoute>
            }
          />
          <Route
            path='forgot-password'
            element={
              <ProtectedRoute onlyUnAuth>
                <ForgotPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path='reset-password'
            element={
              <ProtectedRoute onlyUnAuth>
                <ResetPassword />
              </ProtectedRoute>
            }
          />

          <Route
            path='profile'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path='profile/orders'
            element={
              <ProtectedRoute>
                <ProfileOrders />
              </ProtectedRoute>
            }
          />

          <Route path='feed' element={<Feed />} />

          <Route path='ingredients/:id' element={<IngredientDetails />} />
          <Route path='feed/:number' element={<OrderInfo />} />
          <Route
            path='profile/orders/:number'
            element={
              <ProtectedRoute>
                <OrderInfo />
              </ProtectedRoute>
            }
          />

          <Route path='*' element={<NotFound404 />} />
        </Route>
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title='Детали ингредиента'
                onClose={() => window.history.back()}
              >
                <IngredientDetails />
              </Modal>
            }
          />

          <Route
            path='/feed/:number'
            element={
              <Modal
                title='Детали заказа'
                onClose={() => window.history.back()}
              >
                <OrderInfo />
              </Modal>
            }
          />

          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal
                  title='Детали заказа'
                  onClose={() => window.history.back()}
                >
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
};

export default App;
