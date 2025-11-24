import { supabase } from "../../../supabaseClient";
import { useQuery } from "@tanstack/react-query";

interface UserSessionData {
  isLoggedIn: boolean;
  user: {
    id: string;
    email: string | undefined;
  } | null;
  accessToken: string | null;
}

/**
 * Supabase를 사용하여 현재 로그인된 사용자 정보를 조회하는 커스텀 훅
 * @returns {data, isPending, error} TanStack Query의 반환 값
 */
const useGetUser = () => {
  const result = useQuery<UserSessionData, Error>({
    queryKey: ["user"],
    queryFn: async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        throw new Error(error.message);
      }
      if (session) {
        console.log("현재 로그인된 사용자:", session.user.email);
        return {
          isLoggedIn: true,
          user: session.user,
          accessToken: session.access_token,
        } as UserSessionData;
      }

      return {
        isLoggedIn: false,
        user: null,
        accessToken: null,
      } as UserSessionData;
    },
    staleTime: Infinity,
  });
  return result;
};

export default useGetUser;
