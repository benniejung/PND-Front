import { useMutation } from "@tanstack/react-query";
import { supabase } from "../../../supabaseClient";
import { createErrorObject } from "../../../components/Common/error/utils/errorFactory";
import { AppError } from "../../../components/Common/error/type/error.type";
import { DATABASE_TABLE } from "../../../constants/database";

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
    mutationFn: async (formData: FormData) => {
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      try {
        // 1. Supabase Auth에 사용자 생성
        const { data: authData, error: signUpError } =
          await supabase.auth.signUp({
            email: email,
            password: password,
          });

        if (signUpError) {
          throw createErrorObject(signUpError);
        }

        // 2. users 테이블에 삽입
        const { error: insertError } = await supabase
          .from(DATABASE_TABLE.USERS)
          .insert({
            id: authData.user?.id,
            name: name,
            email: email,
            password: password,
            auth_provider: "email",
            github_id: null,
            username: null,
          });

        if (insertError) {
          throw createErrorObject(insertError);
        }

        return {
          authData,
        };
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data) => {
      return data.authData;
    },
    onError: (error: AppError) => {
      throw error;
    },
  });

  return { signup, isPending, isError, error };
};
