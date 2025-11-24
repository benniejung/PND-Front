import { create } from "zustand";
import useGetUser from "../../supabase/users/hooks/useGetUser.js";
import { useEffect } from "react";

interface UserSessionData {
  isLoggedIn: boolean;
  user: {
    id: string;
    email: string | undefined;
  } | null;
  accessToken: string | null;
}

interface MyProfileStore {
  myProfile: UserSessionData | null;
  setMyProfile: (myProfile: UserSessionData | null) => void;
  clearMyProfile: () => void;
}

export const useMyProfileStore = create<MyProfileStore>((set) => ({
  myProfile: null,
  setMyProfile: (myProfile) => set({ myProfile }),
  clearMyProfile: () => set({ myProfile: null }),
}));

export const useMyProfile = () => {
  const { data: userData, isPending, error } = useGetUser();
  const setMyProfile = useMyProfileStore((state) => state.setMyProfile);
  const clearMyProfile = useMyProfileStore((state) => state.clearMyProfile);

  useEffect(() => {
    if (!isPending) {
      if (userData) {
        setMyProfile(userData);
      } else {
        clearMyProfile();
      }
    }
  }, [userData, isPending, setMyProfile, clearMyProfile]);

  return { isPending, error };
};
