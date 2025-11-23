import { useMutation } from "@tanstack/react-query";
import { supabase } from "../../supabaseClient";
import { createErrorObject } from "./errorFactory";
import { AuthErrorCode, AuthError, AppError } from "./error.type";

/**
 * 로그인 Mutation
 * - 이미 가입된 사용자만 로그인 가능
 * - 비밀번호 확인
 */
export const useLoginMutation = () => {
  const {
    mutate: login,
    isSuccess,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async (data: FormData) => {
      const email = data.get("email") as string;
      const password = data.get("password") as string;
      try {
        // 1단계: 이메일 존재 여부 확인
        const { data: existingUser, error: checkError } = await supabase
          .from("users")
          .select("email")
          .eq("email", email)
          .maybeSingle();

        if (checkError) {
          throw createErrorObject(checkError);
        }

        // 결과가 없는 경우 (이메일이 존재하지 않음)
        // .maybeSingle()은 결과가 없을 때 error: null을 반환하므로
        // checkError는 null이고, existingUser도 null입니다.
        if (!existingUser) {
          throw new AuthError(
            AuthErrorCode.EMAIL_NOT_FOUND,
            AuthErrorCode.EMAIL_NOT_FOUND
          );
        }

        // 2단계: Supabase Auth로 로그인 (비밀번호 검증)
        const { data: authData, error: signInError } =
          await supabase.auth.signInWithPassword({
            email: email,
            password: password,
          });
        if (signInError) {
          throw createErrorObject(signInError);
        }
        return {
          authData,
        };
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data) => {
      return data;
    },
    onError: (error: AppError) => {
      throw error;
    },
  });

  return { login, isPending, isError, error, isSuccess };
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
      console.error("로그아웃 실패:", error);
    },
  });

  return { logout, isPending };
};
