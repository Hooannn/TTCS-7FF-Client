import toastConfig from '../../configs/toast';
import { toast } from 'react-toastify';
import { useMutation } from 'react-query';
import cookies from '../../libs/cookies';
import dayjs from '../../libs/dayjs';
import { onError } from '../../utils/error-handlers';
import { IResponseData, IUser } from '../../types';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser, setLogged, signOut } from '../../slices/auth.slice';
import useAxiosIns from '../../hooks/useAxiosIns';
import { useTranslation } from 'react-i18next';
import { setOrderNote } from '../../slices/app.slice';

interface SignInResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}
interface SignUpResponse {
  email: string;
  password: string;
}
export default () => {
  const { t } = useTranslation();
  const axios = useAxiosIns();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signInMutation = useMutation({
    mutationFn: (account: { email: string; password: string }) => axios.post<IResponseData<SignInResponse>>(`/auth/sign-in/email`, account),
    onError: onError,
    onSuccess: res => {
      const redirectPath = cookies.get('redirect_path') || '/';
      toast(t(res.data.message), toastConfig('success'));
      const { accessToken, refreshToken, user } = res.data.data;
      cookies.set('access_token', accessToken, { path: '/', expires: new Date(dayjs(Date.now()).add(30, 'day').toISOString()) });
      cookies.set('refresh_token', refreshToken, { path: '/', expires: new Date(dayjs(Date.now()).add(30, 'day').toISOString()) });
      navigate(redirectPath as string);
      dispatch(setLogged(true));
      dispatch(setUser(user));
      dispatch(setOrderNote(''));
    },
  });

  const signUpMutation = useMutation({
    mutationFn: (data: { email: string; password: string; firstName: string; lastName: string }) =>
      axios.post<IResponseData<SignUpResponse>>('/auth/sign-up/email', data),
    onError: onError,
    onSuccess: res => {
      const { email, password } = res.data.data;
      signInMutation.mutate({ email, password });
    },
  });

  const googleAuthMutation = useMutation({
    mutationFn: (googleAccessToken: string) => axios.post('/auth/google-auth', { googleAccessToken }),
    onError: onError,
    onSuccess: res => {
      const redirectPath = cookies.get('redirect_path') || '/';
      toast(t(res.data.message), toastConfig('success'));
      const { accessToken, refreshToken, user } = res.data.data;
      cookies.set('access_token', accessToken, { path: '/', expires: new Date(dayjs(Date.now()).add(30, 'day').toISOString()) });
      cookies.set('refresh_token', refreshToken, { path: '/', expires: new Date(dayjs(Date.now()).add(30, 'day').toISOString()) });
      navigate(redirectPath as string);
      dispatch(setLogged(true));
      dispatch(setUser(user));
      dispatch(setOrderNote(''));
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: ({ email }: { email: string }) => axios.post<IResponseData<SignInResponse>>('/auth/forgot-password', { email }),
    onError: onError,
    onSuccess: res => {
      toast(t(res.data.message), toastConfig('success'));
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (data: { password: string; token: string }) => axios.post<IResponseData<SignUpResponse>>('/auth/reset-password', data),
    onError: onError,
    onSuccess: res => {
      toast(t(res.data.message), toastConfig('success'));
    },
  });

  const deactivateAccountMutation = useMutation({
    mutationFn: (data: { password: string }) => axios.post<IResponseData<any>>('/auth/deactivate', data),
    onError: onError,
    onSuccess: res => {
      toast(t(res.data.message), toastConfig('success'));
      dispatch(signOut());
    },
  });

  return { signInMutation, forgotPasswordMutation, signUpMutation, googleAuthMutation, resetPasswordMutation, deactivateAccountMutation };
};
