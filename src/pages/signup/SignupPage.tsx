import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "../../components/Login/style";
import { supabase } from "../../supabaseClient";
// 이미지
import MainLogoImg from "../../assets/images/main-logo.svg";
import SignupForm from "../../components/Login/SignupForm";
import GithubLoginButton from "../../assets/images/alt-profile.png";

export default function SignupPage() {
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
                    회원가입
                </S.LoginMessage>
                <SignupForm />

                {/* 구분선 및 소셜 로그인 */}
                <S.SocialLoginContainer>
                    <S.SocialLoginTitle>소셜로그인</S.SocialLoginTitle>
                    <img src={GithubLoginButton} alt="Github Login" style={{ width: '50px', height: '50px' }} />
                </S.SocialLoginContainer>
            </S.LoginModal>
        </S.LoginContainer>
    );
}


