import { useMutation } from "@tanstack/react-query";
import { supabase } from "../../supabaseClient";
import { getAuthErrorMessage, AuthErrorCode } from "./type.error";

type AuthResponse = {
  user: {
    id: string;
    email: string;
  } | null;
  session: any;
};

export class AuthApiError extends Error {
  name: string;
  code: string;
  status: number;
  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = "AuthApiError";
    this.code = code;
    this.status = status;
  }
}

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
    mutationFn: async (data: FormData): Promise<AuthResponse> => {
      const email = data.get("email") as string;
      const password = data.get("password") as string;
      try {
        // 1단계: 이메일 존재 여부 확인
        const { data: existingUser, error: checkError } = await supabase
          .from("users")
          .select("email")
          .eq("email", email)
          .maybeSingle();

        if (checkError && checkError.code !== "PGRST116") {
          // PGRST116: 결과가 없거나 여러 개일 때 발생하는 에러
          // .maybeSingle()은 결과가 없을 때 정상적으로 null을 반환해야 하지만,
          // 일부 경우 PGRST116 에러가 발생할 수 있어 이를 무시하고
          // 아래의 !existingUser 체크로 처리합니다.
          throw new Error(checkError.message);
        }

        if (!existingUser) {
          throw new AuthApiError(
            getAuthErrorMessage(AuthErrorCode.EMAIL_NOT_FOUND),
            AuthErrorCode.EMAIL_NOT_FOUND,
            404
          );
        }
        // 2단계: Supabase Auth로 로그인 (비밀번호 검증)
        const { data: authData, error: signInError } =
          await supabase.auth.signInWithPassword({
            email: email,
            password: password,
          });
        if (signInError) {
          const errorCode = signInError.code || AuthErrorCode.UNKNOWN_ERROR;
          const errorMessage = getAuthErrorMessage(errorCode);
          throw new AuthApiError(
            errorMessage,
            errorCode,
            signInError.status || 500
          );
        }
        return {
          user: {
            id: authData.user.id,
            email: authData.user.email || "",
          },
          session: authData.session,
        };
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data: AuthResponse) => {
      return data;
    },
    onError: (error: Error) => {
      console.error("로그인 에러:", error);
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
