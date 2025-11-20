import { useMutation } from "@tanstack/react-query";
import { supabase } from "../../supabaseClient";

type UserFormData = {
  email: string;
  password: string;
};

type AuthResponse = {
  user: {
    id: string;
    email: string;
  } | null;
  session: any;
};

/**
 * 로그인 Mutation
 * - 이미 가입된 사용자만 로그인 가능
 * - 비밀번호 확인
 */
export const useLoginMutation = () => {
  const {
    mutate: login,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async (data: UserFormData): Promise<AuthResponse> => {
      // Supabase Auth 로그인
      const { data: authData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

      if (signInError) {
        throw new Error(signInError.message);
      }

      if (!authData.user) {
        throw new Error("로그인 실패: 사용자 정보가 없습니다");
      }

      // users 테이블 정보 확인 (선택사항)
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (userError) {
        console.warn("users 테이블 조회 실패:", userError);
      }

      return {
        user: {
          id: authData.user.id,
          email: authData.user.email || "",
        },
        session: authData.session,
      };
    },
    onSuccess: (data) => {
      alert("로그인 성공");
      return data;
    },
    onError: (error: Error) => {
      alert("로그인 실패");
      throw error;
    },
  });

  return { login, isPending, isError, error };
};

/**
 * 로그아웃 Mutation
 */
export const useLogoutMutation = () => {
  const { mutate: logout, isPending } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      return;
    },
    onError: (error: Error) => {
      throw error;
    },
  });

  return { logout, isPending };
};
