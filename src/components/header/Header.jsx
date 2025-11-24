import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as S from "./HeaderStyle.jsx";
import logoSrc from "../../assets/images/main-logo.svg";
import altlogo from "../../assets/images/alt-profile.png";
import { useMyProfileStore } from "../../store/myprofile/myprofile.store.js";
import { useLogoutMutation } from "../../supabase/users/hooks/useLogoutMutaion";
import { toast } from "react-hot-toast";

function Header() {
  const [userImage, setUserImage] = useState(null); // 기본 이미지
  const [logined, setLogined] = useState(false);
  const { myProfile, clearMyProfile } = useMyProfileStore();
  const { logout, isPending } = useLogoutMutation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userInfo = sessionStorage.getItem("userInfo");
    const userToken = sessionStorage.getItem("token");

    if (userInfo || userToken) {
      const parsedUserInfo = JSON.parse(userInfo);
      setLogined(true);
      setUserImage(parsedUserInfo.image);
    } else {
      //로그인 했다가 로그아웃 시를 위해
      setLogined(false);
      setUserImage(null);
    }
  }, [location]);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        clearMyProfile();
        sessionStorage.clear();
        toast.success("로그아웃되었습니다.");
        navigate("/");
      },
      onError: (error) => {
        toast.error("로그아웃에 실패했습니다.");
        console.error("로그아웃 에러:", error);
      },
    });
  };

  return (
    <S.HeaderLayout>
      <S.HeaderContent>
        <Link to="/">
          <S.Logo src={logoSrc} alt="Logo" />
        </Link>
        <S.NavLinks>
          <Link to="/">
            <S.NavLink className={location.pathname === "/" ? "active" : ""}>
              HOME
            </S.NavLink>
          </Link>
          <Link to="/readme">
            <S.NavLink
              className={location.pathname === "/readme" ? "active" : ""}
            >
              README
            </S.NavLink>
          </Link>
          <Link to="/diagram">
            <S.NavLink
              className={location.pathname === "/diagram" ? "active" : ""}
            >
              DIAGRAM
            </S.NavLink>
          </Link>
          <Link to="/report">
            <S.NavLink
              className={location.pathname === "/report" ? "active" : ""}
            >
              GITHUB REPORT
            </S.NavLink>
          </Link>
          <Link to="/myprojects">
            <S.NavLink
              className={location.pathname === "/myprojects" ? "active" : ""}
            >
              MY PROJECTS
            </S.NavLink>
          </Link>
        </S.NavLinks>
        {myProfile?.isLoggedIn ? (
          <S.NavLink
            onClick={handleLogout}
            style={{ cursor: "pointer" }}
            disabled={isPending}
          >
            {isPending ? "로그아웃 중..." : "로그아웃"}
          </S.NavLink>
        ) : (
          <Link to="/login">
            <S.NavLink
              className={location.pathname === "/login" ? "active" : ""}
            >
              로그인
            </S.NavLink>
          </Link>
        )}
      </S.HeaderContent>
    </S.HeaderLayout>
  );
}

export default Header;
