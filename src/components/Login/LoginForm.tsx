import React, { useState } from "react";
import { z } from "zod";
import * as S from "./style";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../supabase/users/hooks/useLoginMutaion";
import { getUserFriendlyErrorMessage } from "../../supabase/users/utils/errorFactory";
import toast from "react-hot-toast";

const USER_SCHEMA = z.object({
  email: z.email("이메일 형식이 올바르지 않습니다."),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
});

type UserFormData = z.infer<typeof USER_SCHEMA>;

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(USER_SCHEMA),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const emailValue = watch("email");
  const passwordValue = watch("password");

  // 이메일과 비밀번호가 모두 입력되어 있을 때만 버튼 활성화
  const isFormValid = emailValue && emailValue.trim() !== "" && passwordValue && passwordValue.trim() !== "";

  const navigate = useNavigate();
  const { login, isPending, isSuccess, isError, error } = useLoginMutation();

  const onSubmit = async (data: UserFormData) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    login(formData);
  };

  React.useEffect(() => {
    if (isSuccess) {
      toast.success("로그인에 성공했습니다!");
      navigate("/");
    }
    if (isError && error) {
      const errorMessage =
        getUserFriendlyErrorMessage(error);
      toast.error(errorMessage);
    }
  }, [isSuccess, isError, error, navigate]);

  return (
    <S.Form onSubmit={handleSubmit(onSubmit)}>
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
              placeholder="비밀번호를 입력하세요"
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
      <S.SubmitButton type="submit" disabled={!isFormValid || isPending} onClick={handleSubmit(onSubmit)}>
        {isPending ? "로그인 중..." : "로그인"}
      </S.SubmitButton>
    </S.Form>
  );
};

export default LoginForm;
