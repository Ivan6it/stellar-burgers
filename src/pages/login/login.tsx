import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../services/store';
import { loginUser, checkUserAuth } from '../../services/userSlice';
import { useLocation } from 'react-router-dom';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const error = useSelector((state: RootState) => state.user.error);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      await dispatch(checkUserAuth()).unwrap();

      const from = location.state?.from || '/';

      navigate(from, { replace: true });
    } catch {}
  };

  return (
    <LoginUI
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      errorText={error || ''}
      handleSubmit={handleSubmit}
    />
  );
};
