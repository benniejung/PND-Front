import { z } from "zod";
import * as S from "./style";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignupMutation } from "./useSignupMutaion";

const USER_SCHEMA = z
    .object({
        name: z.string().min(1, "이름을 입력해주세요."),
        email: z.string().email("이메일 형식이 올바르지 않습니다."),
        password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
        passwordConfirm: z.string().min(1, "비밀번호 확인을 입력해주세요."),
    })
    .refine((data) => data.password === data.passwordConfirm, {
        message: "비밀번호가 일치하지 않습니다.",
        path: ["passwordConfirm"],
    });

type UserFormData = z.infer<typeof USER_SCHEMA>;

const SignupForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(USER_SCHEMA),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            passwordConfirm: "",
        },
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const navigate = useNavigate();
    const { signup, isPending } = useSignupMutation();

    const onSubmit = async (data: UserFormData) => {
        const { passwordConfirm, ...signupData } = data;
        signup(signupData, {
            onSuccess: () => {
                navigate("/login");
            },
        });
    };

    return (
        <S.Form onSubmit={handleSubmit(onSubmit)}>
            <S.InputContainer>
                <S.InputLabel>이름</S.InputLabel>
                <S.InputField
                    type="text"
                    placeholder="이름을 입력하세요"
                    {...register("name")}
                />
                {errors.name && <S.ErrorMessage>{errors.name.message}</S.ErrorMessage>}
            </S.InputContainer>
            <S.InputContainer>
                <S.InputLabel>이메일</S.InputLabel>
                <S.InputField
                    type="email"
                    placeholder="이메일을 입력하세요"
                    {...register("email")}
                />
                {errors.email && <S.ErrorMessage>{errors.email.message}</S.ErrorMessage>}
            </S.InputContainer>
            <S.InputContainer>
                <S.InputLabel>비밀번호</S.InputLabel>
                <S.PasswordInputWrapper>
                    <S.PasswordInputContainer>
                        <S.InputField
                            type={showPassword ? "text" : "password"}
                            placeholder="비밀번호를 입력하세요 (8자 이상)"
                            {...register("password")}
                        />
                        <S.PasswordToggleButton
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <S.EyeIcon viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="3"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />
                                </S.EyeIcon>
                            ) : (
                                <S.EyeOffIcon viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <line
                                        x1="1"
                                        y1="1"
                                        x2="23"
                                        y2="23"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </S.EyeOffIcon>
                            )}
                        </S.PasswordToggleButton>
                    </S.PasswordInputContainer>
                    {errors.password && <S.ErrorMessage>{errors.password.message}</S.ErrorMessage>}
                </S.PasswordInputWrapper>
            </S.InputContainer>
            <S.InputContainer>
                <S.InputLabel>비밀번호 확인</S.InputLabel>
                <S.PasswordInputWrapper>
                    <S.PasswordInputContainer>
                        <S.InputField
                            type={showPasswordConfirm ? "text" : "password"}
                            placeholder="비밀번호를 다시 입력하세요"
                            {...register("passwordConfirm")}
                        />
                        <S.PasswordToggleButton
                            type="button"
                            onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                        >
                            {showPasswordConfirm ? (
                                <S.EyeIcon viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="3"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />
                                </S.EyeIcon>
                            ) : (
                                <S.EyeOffIcon viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <line
                                        x1="1"
                                        y1="1"
                                        x2="23"
                                        y2="23"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </S.EyeOffIcon>
                            )}
                        </S.PasswordToggleButton>
                    </S.PasswordInputContainer>
                    {errors.passwordConfirm && <S.ErrorMessage>{errors.passwordConfirm.message}</S.ErrorMessage>}
                </S.PasswordInputWrapper>
            </S.InputContainer>
            <S.SubmitButton type="submit" disabled={isPending}>
                {isPending ? "회원가입 중..." : "회원가입하기"}
            </S.SubmitButton>
            <div style={{ textAlign: "center", marginTop: "15px" }}>이미 계정이 있으신가요? <S.SignupLink onClick={() => navigate("/login")}>로그인하기</S.SignupLink></div>
        </S.Form>
    );
};

export default SignupForm;

