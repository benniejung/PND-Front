import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "../../components/Login/style";
import { supabase } from "../../supabaseClient";
// 이미지
import MainLogoImg from "../../assets/images/main-logo.svg";
import SignupForm from "../../components/Login/SignupForm";

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
                    P-ND에 오신 것을 환영합니다.
                    <br />
                    회원가입을 진행해주세요.
                </S.LoginMessage>
                <SignupForm />
                <S.LoginButton onClick={signInWithGithub}></S.LoginButton>
                <S.LoginBottomText>
                    깃허브로 회원가입을 하고
                    <br />
                    P-ND의 더 많은 서비스를 사용해보세요!
                </S.LoginBottomText>
            </S.LoginModal>
        </S.LoginContainer>
    );
}


