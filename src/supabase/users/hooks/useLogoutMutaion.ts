import { supabase } from "../../../supabaseClient";
import { useMutation } from "@tanstack/react-query";

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
