import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser, loginUser, logoutUser, registerUser } from "./api";

export const authKeys = { me: ["auth", "me"] as const };

/** Current user from /auth/me (undefined when logged out). Cached and shared app-wide. */
export const useGetUser = () =>
  useQuery({ queryKey: authKeys.me, queryFn: getUser, retry: false, staleTime: 5 * 60_000 });

export function useLoginUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: authKeys.me }),
  });
}

export function useRegisterUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: authKeys.me }),
  });
}

export function useLogoutUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      qc.clear();
    },
  });
}
