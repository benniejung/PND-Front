import React from "react";
import { useNavigate, useRouteError, isRouteErrorResponse } from "react-router-dom";
import styled from "styled-components";

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
  text-align: center;
`;

const ErrorTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const ErrorDetails = styled.pre`
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  color: #d32f2f;
  font-size: 0.9rem;
  text-align: left;
  max-width: 600px;
  overflow-x: auto;
  margin-bottom: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: 0.75rem 2rem;
  background-color: ${(props) => (props.variant === "primary" ? "#5b59fc" : "#f5f5f5")};
  color: ${(props) => (props.variant === "primary" ? "white" : "#333")};
  border: ${(props) => (props.variant === "primary" ? "none" : "1px solid #ddd")};
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: ${(props) => (props.variant === "primary" ? "#4a48e0" : "#e0e0e0")};
  }
`;

const ErrorPage = () => {
    const navigate = useNavigate();
    const error = useRouteError();

    let errorMessage = "알 수 없는 오류가 발생했습니다.";
    let statusCode: number | undefined;
    let errorDetails: string | undefined;

    if (isRouteErrorResponse(error)) {
        statusCode = error.status;
        errorMessage = error.statusText || errorMessage;
        errorDetails = error.data?.message || error.data?.toString();
    } else if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
        errorDetails = error.stack;
    }

    const handleGoHome = () => {
        navigate("/");
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <ErrorContainer>
            {statusCode && <div style={{ fontSize: "4rem", fontWeight: 700, color: "#d32f2f", marginBottom: "1rem" }}>{statusCode}</div>}
            <ErrorTitle>오류가 발생했습니다</ErrorTitle>
            <ErrorMessage>{errorMessage}</ErrorMessage>
            {errorDetails && (
                <ErrorDetails>{typeof errorDetails === "string" ? errorDetails : JSON.stringify(errorDetails, null, 2)}</ErrorDetails>
            )}
            <ButtonGroup>
                <Button variant="primary" onClick={handleGoHome}>
                    홈으로 돌아가기
                </Button>
                <Button variant="secondary" onClick={handleGoBack}>
                    이전 페이지로
                </Button>
            </ButtonGroup>
        </ErrorContainer>
    );
};

export default ErrorPage;

