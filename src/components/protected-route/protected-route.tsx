import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState } from '../../services/store';

type Props = {
  children: React.ReactNode;
  onlyUnAuth?: boolean;
};

const ProtectedRoute = ({ children, onlyUnAuth = false }: Props) => {
  const user = useSelector((state: RootState) => state.user.user);
  const location = useLocation();

  if (onlyUnAuth && user) {
    return <Navigate to='/' replace />;
  }
  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }
  return children;
};

export default ProtectedRoute;
