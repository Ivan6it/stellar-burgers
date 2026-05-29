import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState } from '../../services/store';
import { Preloader } from '@ui';

type Props = {
  children: React.ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({ children, onlyUnAuth = false }: Props) => {
  const user = useSelector((state: RootState) => state.user.user);
  const isAuthChecked = useSelector(
    (state: RootState) => state.user.isAuthChecked
  );
  const isLoading = useSelector((state: RootState) => state.user.loading);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (isLoading) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
