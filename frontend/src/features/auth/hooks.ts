import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUser, loginUser, logoutUser, registerUser } from './api';

export const authKeys = { me: ['auth', 'me'] as const };

export const useRegisterUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: authKeys.me }),
  });
};
export const useLoginUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: authKeys.me }),
  });
};
export const useLogoutUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: authKeys.me }),
  });
};

export const useGetUser = () =>
  useQuery({
    queryKey: authKeys.me,
    queryFn: getUser,
    retry: false,
    staleTime: 5 * 60_000,
  });
