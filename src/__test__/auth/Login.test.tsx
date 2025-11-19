import React from "react";
import { describe, expect, vi, beforeEach, test } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "../../style/theme";
import LoginModal from "../../components/Login/LoginModal";
import { supabase } from "../../supabaseClient";
import { AuthError, Session } from "@supabase/supabase-js";
import Main from "../../pages/main/Main";

// useNavigate 모킹
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});

// supabase 모킹
vi.mock("../../supabaseClient", () => {
    const mockGetSession = vi.fn();
    const mockSignInWithOAuth = vi.fn();

    return {
        supabase: {
            auth: {
                getSession: mockGetSession,
                signInWithOAuth: mockSignInWithOAuth,
            },
        },
    };
});

describe("Login - Main 컴포넌트", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        sessionStorage.clear();
    });

    // 테스트 헬퍼: Router와 ThemeProvider로 감싸서 렌더링
    const renderWithRouter = (component: React.ReactElement) => {
        return render(
            <ThemeProvider theme={theme}>
                <BrowserRouter>{component}</BrowserRouter>
            </ThemeProvider>
        );
    };

    const MOCK_GET_SESSION = vi.mocked(supabase.auth.getSession);

    const MOCK_EMPTY_SESSION: Session = {
        access_token: null,
        refresh_token: null,
        expires_in: null,
        expires_at: null,
        token_type: null,
        user: null,
    };

    const MOCK_SESSION: Session = {
        access_token: "mock-access-token",
        refresh_token: "mock-refresh-token",
        expires_in: 3600,
        expires_at: Date.now() / 1000 + 3600,
        token_type: "bearer",
        user: {
            id: "mock-user-id",
            aud: "authenticated",
            role: "authenticated",
            email: "test@example.com",
            email_confirmed_at: new Date().toISOString(),
            phone: "",
            confirmed_at: new Date().toISOString(),
            last_sign_in_at: new Date().toISOString(),
            app_metadata: {},
            user_metadata: {},
            identities: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
    };

    test("Main 컴포넌트가 렌더링되면, supabase.auth.getSession() 호출되어야 한다", async () => {
        MOCK_GET_SESSION.mockResolvedValue({
            data: {
                session: MOCK_EMPTY_SESSION,
            },
            error: null,
        });

        renderWithRouter(<Main />);

        await waitFor(() => {
            expect(MOCK_GET_SESSION).toHaveBeenCalled();
        });
    });

    test("세션의 토큰이 존재하지 않으면, 깃허브 소셜 로그인 버튼이 나타나야한다", async () => {
        MOCK_GET_SESSION.mockResolvedValue({
            data: {
                session: MOCK_EMPTY_SESSION,
            },
            error: null,
        });

        renderWithRouter(<Main />);
        const loginButton = await screen.findByRole("button", { name: /깃허브 소셜 로그인/ });

        await waitFor(() => {
            expect(loginButton).toHaveTextContent("깃허브 소셜 로그인");
            expect(loginButton).toHaveAttribute("href", "/login");
        });
    });

    test("세션의 토큰이 존재하면, 마이페이지 가기 버튼이 나타나야한다", async () => {
        const mockNavigate = vi.fn();
        vi.mocked(useNavigate).mockReturnValue(mockNavigate);

        MOCK_GET_SESSION.mockResolvedValue({
            data: {
                session: MOCK_SESSION,
            },
            error: null,
        });

        renderWithRouter(<Main />);
        const loginButton = await screen.findByRole("button", { name: /마이페이지 가기/ });

        await waitFor(() => {
            expect(loginButton).toHaveTextContent("마이페이지 가기");
        });

        await userEvent.click(loginButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/myProjects");
        });
    });
});

describe("Login - LoginModal 컴포넌트", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        sessionStorage.clear();
    });

    // 테스트 헬퍼: Router와 ThemeProvider로 감싸서 렌더링
    const renderWithRouter = (component: React.ReactElement) => {
        return render(
            <ThemeProvider theme={theme}>
                <BrowserRouter>{component}</BrowserRouter>
            </ThemeProvider>
        );
    };

    const MOCK_SIGN_IN_WITH_OAUTH = vi.mocked(supabase.auth.signInWithOAuth);
    const MOCK_ERROR = {
        message: "Authentication failed",
        status: 400,
        name: "AuthError",
        code: "auth_failed",
    };

    const CONSOLE_ERROR_SPY = vi.spyOn(console, "error").mockImplementation(() => { });
    const mockNavigate = vi.fn();

    test("깃허브 로그인 성공 시 signInWithOAuth가 올바른 파라미터로 호출되어야 한다", async () => {
        MOCK_SIGN_IN_WITH_OAUTH.mockResolvedValue({
            data: {
                provider: "github",
                url: "https://github.com/login/oauth/authorize",
            },
            error: null,
        });

        renderWithRouter(<LoginModal onSuccess={vi.fn()} />);
        const loginButton = screen.getByRole("button");

        await userEvent.click(loginButton);

        await waitFor(() => {
            expect(MOCK_SIGN_IN_WITH_OAUTH).toHaveBeenCalledWith({
                provider: "github",
                options: {
                    redirectTo: "http://localhost:3000",
                },
            });
        });
    });

    test("깃허브 로그인 실패 시 LoginError 페이지로 리다이렉트되어야 한다", async () => {
        vi.mocked(useNavigate).mockReturnValue(mockNavigate);

        MOCK_SIGN_IN_WITH_OAUTH.mockResolvedValue({
            data: {
                provider: null,
                url: null,
            },
            error: MOCK_ERROR as AuthError,
        });

        renderWithRouter(<LoginModal onSuccess={vi.fn()} />);
        const loginButton = screen.getByRole("button");

        await userEvent.click(loginButton);

        await waitFor(() => {
            expect(CONSOLE_ERROR_SPY).toHaveBeenCalledWith("Login Error");
            expect(mockNavigate).toHaveBeenCalledWith("/login-error");
        });
    });

    test("깃허브 로그인 중 예외 발생 시 LoginError 페이지로 리다이렉트되어야 한다", async () => {
        vi.mocked(useNavigate).mockReturnValue(mockNavigate);

        MOCK_SIGN_IN_WITH_OAUTH.mockRejectedValue(new Error("Network error"));

        renderWithRouter(<LoginModal onSuccess={vi.fn()} />);
        const loginButton = screen.getByRole("button");

        await userEvent.click(loginButton);

        await waitFor(() => {
            expect(CONSOLE_ERROR_SPY).toHaveBeenCalledWith("Login Error");
            expect(mockNavigate).toHaveBeenCalledWith("/login-error");
        });
    });

});

