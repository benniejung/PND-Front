import React from "react";
import { describe, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "../../style/theme";
import SignupForm from "../../components/Login/SignupForm";
import { useSignupMutation } from "../../supabase/users/hooks/useSignupMutaion";
import { toast } from "react-hot-toast";

// useNavigate 모킹
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// useSignupMutation 모킹
vi.mock("../../supabase/users/hooks/useSignupMutaion", () => ({
    useSignupMutation: vi.fn(),
}));

// react-hot-toast 모킹
vi.mock("react-hot-toast", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe("Signup", () => {
    const mockSignup = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useSignupMutation).mockReturnValue({
            signup: mockSignup,
            isPending: false,
            isError: false,
            error: null,
        });
    });

    // 테스트 헬퍼: Router와 ThemeProvider로 감싸서 렌더링
    const renderWithRouter = (component: React.ReactElement) => {
        return render(
            <ThemeProvider theme={theme}>
                <BrowserRouter>{component}</BrowserRouter>
            </ThemeProvider>
        );
    };

    it("이름을 입력하지 않으면 유효성 검사 에러가 발생해야한다.", async () => {
        const user = userEvent.setup();
        renderWithRouter(<SignupForm />);

        const submitButton = screen.getByRole("button", { name: "회원가입하기" });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText("이름을 입력해주세요.")).toBeInTheDocument();
        });
    });

    it("이메일을 입력하지 않으면 유효성 검사 에러가 발생해야한다.", async () => {
        const user = userEvent.setup();
        renderWithRouter(<SignupForm />);

        const nameInput = screen.getByPlaceholderText("이름을 입력하세요");
        await user.type(nameInput, "홍길동");

        const submitButton = screen.getByRole("button", { name: "회원가입하기" });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText("이메일을 입력해주세요.")).toBeInTheDocument();
        });
    });

    it("이메일 형식이 올바르지 않으면 유효성 검사 에러가 발생해야한다.", async () => {
        const user = userEvent.setup();
        renderWithRouter(<SignupForm />);

        const nameInput = screen.getByPlaceholderText("이름을 입력하세요");
        const emailInput = screen.getByPlaceholderText("이메일을 입력하세요");
        const passwordInput = screen.getByPlaceholderText("비밀번호를 입력하세요 (8자 이상)");
        const passwordConfirmInput = screen.getByPlaceholderText("비밀번호를 다시 입력하세요");

        await user.type(nameInput, "홍길동");
        await user.type(emailInput, "invalid@email"); // @는 있지만 도메인이 없음
        await user.type(passwordInput, "12345678");
        await user.type(passwordConfirmInput, "12345678");

        const submitButton = screen.getByRole("button", { name: "회원가입하기" });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText("이메일 형식이 올바르지 않습니다.")).toBeInTheDocument();
        }, { timeout: 3000 });
    });

    it("비밀번호가 8자 미만이면 유효성 검사 에러가 발생해야한다.", async () => {
        const user = userEvent.setup();
        renderWithRouter(<SignupForm />);

        const nameInput = screen.getByPlaceholderText("이름을 입력하세요");
        const emailInput = screen.getByPlaceholderText("이메일을 입력하세요");
        const passwordInput = screen.getByPlaceholderText("비밀번호를 입력하세요 (8자 이상)");

        await user.type(nameInput, "홍길동");
        await user.type(emailInput, "test@example.com");
        await user.type(passwordInput, "1234567"); // 7자

        const submitButton = screen.getByRole("button", { name: "회원가입하기" });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText("비밀번호는 8자 이상이어야 합니다.")).toBeInTheDocument();
        });
    });

    it("비밀번호 확인을 입력하지 않으면 유효성 검사 에러가 발생해야한다.", async () => {
        const user = userEvent.setup();
        renderWithRouter(<SignupForm />);

        const nameInput = screen.getByPlaceholderText("이름을 입력하세요");
        const emailInput = screen.getByPlaceholderText("이메일을 입력하세요");
        const passwordInput = screen.getByPlaceholderText("비밀번호를 입력하세요 (8자 이상)");

        await user.type(nameInput, "홍길동");
        await user.type(emailInput, "test@example.com");
        await user.type(passwordInput, "12345678");

        const submitButton = screen.getByRole("button", { name: "회원가입하기" });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText("비밀번호 확인을 입력해주세요.")).toBeInTheDocument();
        });
    });

    it("비밀번호와 비밀번호 확인이 일치하지 않으면 유효성 검사 에러가 발생해야한다.", async () => {
        const user = userEvent.setup();
        renderWithRouter(<SignupForm />);

        const nameInput = screen.getByPlaceholderText("이름을 입력하세요");
        const emailInput = screen.getByPlaceholderText("이메일을 입력하세요");
        const passwordInput = screen.getByPlaceholderText("비밀번호를 입력하세요 (8자 이상)");
        const passwordConfirmInput = screen.getByPlaceholderText("비밀번호를 다시 입력하세요");

        await user.type(nameInput, "홍길동");
        await user.type(emailInput, "test@example.com");
        await user.type(passwordInput, "12345678");
        await user.type(passwordConfirmInput, "87654321"); // 다른 비밀번호

        const submitButton = screen.getByRole("button", { name: "회원가입하기" });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText("비밀번호가 일치하지 않습니다.")).toBeInTheDocument();
        });
    });

    it("모든 필드가 유효하면 회원가입이 성공해야한다.", async () => {
        const user = userEvent.setup();
        mockSignup.mockImplementation((formData, callbacks) => {
            callbacks?.onSuccess?.();
        });

        renderWithRouter(<SignupForm />);

        const nameInput = screen.getByPlaceholderText("이름을 입력하세요");
        const emailInput = screen.getByPlaceholderText("이메일을 입력하세요");
        const passwordInput = screen.getByPlaceholderText("비밀번호를 입력하세요 (8자 이상)");
        const passwordConfirmInput = screen.getByPlaceholderText("비밀번호를 다시 입력하세요");

        await user.type(nameInput, "홍길동");
        await user.type(emailInput, "test@example.com");
        await user.type(passwordInput, "12345678");
        await user.type(passwordConfirmInput, "12345678");

        const submitButton = screen.getByRole("button", { name: "회원가입하기" });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockSignup).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalledWith("회원가입에 성공했습니다!");
            expect(mockNavigate).toHaveBeenCalledWith("/login");
        });
    });

    it("회원가입 실패 시 에러 토스트가 표시되어야한다.", async () => {
        const user = userEvent.setup();
        mockSignup.mockImplementation((formData, callbacks) => {
            callbacks?.onError?.({ message: "회원가입 실패", error: new Error("회원가입 실패") });
        });

        renderWithRouter(<SignupForm />);

        const nameInput = screen.getByPlaceholderText("이름을 입력하세요");
        const emailInput = screen.getByPlaceholderText("이메일을 입력하세요");
        const passwordInput = screen.getByPlaceholderText("비밀번호를 입력하세요 (8자 이상)");
        const passwordConfirmInput = screen.getByPlaceholderText("비밀번호를 다시 입력하세요");

        await user.type(nameInput, "홍길동");
        await user.type(emailInput, "test@example.com");
        await user.type(passwordInput, "12345678");
        await user.type(passwordConfirmInput, "12345678");

        const submitButton = screen.getByRole("button", { name: "회원가입하기" });
        await user.click(submitButton);
    });
});