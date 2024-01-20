import { PropsWithChildren, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthState, setLogged, setUser } from '../slices/auth.slice';
import { IResponseData, IRole, IUser } from '../types';
import { RootState } from '../store';
import Loading from './shared/Loading';
import cookies from '../libs/cookies';
import useAxiosIns from '../hooks/useAxiosIns';

interface AuthProtectorProps extends PropsWithChildren {
  redirect: string;
  allowedRoles?: IRole[];
}

export default function AuthProtector({ children, redirect, allowedRoles }: AuthProtectorProps) {
  const accessToken = cookies.get('access_token') || localStorage.getItem('access_token');
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth as AuthState);
  const location = useLocation();
  const axios = useAxiosIns();

  useEffect(() => {
    cookies.set('redirect_path', location.pathname);
  }, [location]);

  const redirectFn = () => {
    dispatch(setLogged(false));
    dispatch(setUser(null as any));
    return <Navigate to={redirect} replace />;
  };

  const { refetch: getAuthUser } = useQuery('auth-user', {
    queryFn: () => axios.get<IResponseData<IUser>>(`/auth/user`),
    onSuccess: res => {
      const user = res.data.data;
      if (!user.userId) redirectFn();
      dispatch(setLogged(true));
      dispatch(setUser(user));
    },
    onError: () => redirectFn(),
    staleTime: 10 * 60 * 1000,
    enabled: false,
  });

  if (!auth.isLogged) {
    if (accessToken) {
      getAuthUser();
    } else return redirectFn();
  } else {
    const isAllowed = allowedRoles?.includes(auth.user?.role as IRole);
    if (isAllowed) return <>{children}</>;
    return redirectFn();
  }

  return <Loading />;
}
