import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "../../components/Login/style";
import { supabase } from "../../supabaseClient";
import { ErrorBoundary } from "react-error-boundary";
// 이미지
import MainLogoImg from "../../assets/images/main-logo.svg";
import LoginForm from "../../components/Login/LoginForm";

type LoginTab = "email" | "github";

export default function LoginPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<LoginTab>("email");

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
                    로그인
                </S.LoginMessage>

                {/* 탭 메뉴 */}
                <S.TabContainer>
                    <S.Tab
                        {...({ $active: activeTab === "email" } as any)}
                        onClick={() => setActiveTab("email")}
                    >
                        이메일 로그인
                    </S.Tab>
                    <S.Tab
                        {...({ $active: activeTab === "github" } as any)}
                        onClick={() => setActiveTab("github")}
                    >
                        깃허브 로그인
                    </S.Tab>
                </S.TabContainer>

                {/* 탭별 컨텐츠 */}
                {activeTab === "email" ? (
                    <ErrorBoundary FallbackComponent={() => <div>에러가 발생했습니다.</div>}>
                        <LoginForm />
                    </ErrorBoundary>
                ) : (
                    <>
                        <S.LoginButton onClick={signInWithGithub}></S.LoginButton>
                        <S.LoginBottomText>
                            깃허브로 로그인을 하고
                            <br />
                            P-ND의 더 많은 서비스를 사용해보세요!
                        </S.LoginBottomText>
                    </>
                )}

                {/* 회원가입 링크 */}
                <S.SignupLinkContainer>
                    <S.SignupLinkText>
                        아직 회원이 아닌가요?{" "}
                        <S.SignupLink onClick={() => navigate("/signup")}>
                            가입하기
                        </S.SignupLink>
                    </S.SignupLinkText>
                </S.SignupLinkContainer>
            </S.LoginModal>
        </S.LoginContainer>
    );
}

