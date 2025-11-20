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
 * 회원가입 Mutation
 * - Supabase Auth에 사용자 생성
 * - users 테이블에 자동으로 데이터 삽입 (트리거 또는 수동)
 */
export const useSignupMutation = () => {
  const {
    mutate: signup,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async (data: UserFormData): Promise<AuthResponse> => {
      // 1. Supabase Auth에 사용자 생성
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email: data.email,
          password: data.password,
          options: {
            // 이메일 인증 없이 바로 로그인 (개발용)
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        }
      );

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      if (!authData.user) {
        throw new Error("회원가입 실패: 사용자 정보가 없습니다");
      }

      // 2. users 테이블에 삽입
      const { error: insertError } = await supabase.from("users").insert({
        id: authData.user.id,
        email: authData.user.email,
        // GitHub 로그인이 아닌 경우 기본값
        github_id: null,
        username: authData.user.email?.split("@")[0] || "user",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (insertError) {
        console.error("users 테이블 삽입 실패:", insertError);
        // Auth 사용자는 생성되었으므로 에러를 던지지 않음
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
      alert("회원가입 성공");
      return data;
    },
    onError: (error: Error) => {
      alert("회원가입 실패");
      throw error;
    },
  });

  return { signup, isPending, isError, error };
};
