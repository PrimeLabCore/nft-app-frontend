import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

export default function useRedirectIfUserLoggedIn() {
  const { user } = useSelector((state) => state.authReducer);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      if (location.pathname === '/signup') {
        navigate('/signup/create-account', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [user]);
}
