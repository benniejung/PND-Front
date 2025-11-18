import React from "react";
import { describe, expect, vi, beforeEach, test } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import LoginModal from "../../components/Login/LoginModal";
import { supabase } from "../../supabaseClient";
import { AuthError } from "@supabase/supabase-js";

// supabase 모킹
vi.mock("../../supabaseClient", () => ({
    supabase: {
        auth: {
            signInWithOAuth: vi.fn(),
        },
    },
}));

// window.location.origin 모킹
Object.defineProperty(window, "location", {
    value: {
        origin: "http://localhost:3000",
    },
    writable: true,
});

// console.error 모킹
const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => { });

// React Router 모킹
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// 테스트 헬퍼: Router로 감싸서 렌더링
const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("Login - GitHub 소셜 로그인", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("깃허브 로그인 버튼이 렌더링되어야 한다", () => {
        renderWithRouter(<LoginModal onSuccess={vi.fn()} />);
        const loginButton = screen.getByRole("button");
        expect(loginButton).toBeInTheDocument();
    });

    test("깃허브 로그인 성공 시 signInWithOAuth가 올바른 파라미터로 호출되어야 한다", async () => {
        const mockSignInWithOAuth = vi.mocked(supabase.auth.signInWithOAuth);
        mockSignInWithOAuth.mockResolvedValue({
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
            expect(mockSignInWithOAuth).toHaveBeenCalledWith({
                provider: "github",
                options: {
                    redirectTo: "http://localhost:3000",
                },
            });
        });
    });

    test("깃허브 로그인 실패 시 LoginError 페이지로 리다이렉트되어야 한다", async () => {
        const mockSignInWithOAuth = vi.mocked(supabase.auth.signInWithOAuth);
        const mockError = {
            message: "Authentication failed",
            status: 400,
            name: "AuthError",
            code: "auth_failed",
        };
        mockSignInWithOAuth.mockResolvedValue({
            data: {
                provider: null,
                url: null,
            },
            error: mockError as AuthError,
        });

        renderWithRouter(<LoginModal onSuccess={vi.fn()} />);
        const loginButton = screen.getByRole("button");

        await userEvent.click(loginButton);

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith("Login Error");
            expect(mockNavigate).toHaveBeenCalledWith("/login-error");
        });
    });

    test("깃허브 로그인 중 예외 발생 시 LoginError 페이지로 리다이렉트되어야 한다", async () => {
        const mockSignInWithOAuth = vi.mocked(supabase.auth.signInWithOAuth);
        mockSignInWithOAuth.mockRejectedValue(new Error("Network error"));

        renderWithRouter(<LoginModal onSuccess={vi.fn()} />);
        const loginButton = screen.getByRole("button");

        await userEvent.click(loginButton);

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith("Login Error");
            expect(mockNavigate).toHaveBeenCalledWith("/login-error");
        });
    });

});

