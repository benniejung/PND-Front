import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "../../components/Login/style";
import { API } from "../../api/axios";
import { supabase } from "../../supabaseClient";
// 이미지
import MainLogoImg from "../../assets/images/main-logo.svg";
import LoginForm from "../../components/Login/LoginForm";

export default function LoginPage() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // 깃허브 로그인
    async function signInWithGithub() {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "github",
                options: {
                    redirectTo: `${window.location.origin}/home`,
                },
            });
            if (error) {
                console.error("Login Error");
                navigate("/login-error");
                return;
            }
        } catch (err) {
            console.error("Login Error");
            navigate("/login-error");
        }
    }

    return (
        <S.LoginContainer>
            <S.LoginModal>
                <S.LogoImg src={MainLogoImg} />
                <S.LoginMessage>
                    로그인이 필요한 기능입니다.
                    <br />
                    로그인 하시겠습니까?
                </S.LoginMessage>
                <LoginForm />
                <S.LoginButton onClick={signInWithGithub}></S.LoginButton>
                <S.LoginBottomText>
                    깃허브로 로그인을 하고
                    <br />
                    P-ND의 더 많은 서비스를 사용해보세요!
                </S.LoginBottomText>
            </S.LoginModal>
        </S.LoginContainer>
    );
}

