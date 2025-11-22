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
  font-size: 3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
`;

const ErrorCode = styled.div`
  font-size: 6rem;
  font-weight: 700;
  color: #5b59fc;
  margin-bottom: 1rem;
`;

const HomeButton = styled.button`
  padding: 0.75rem 2rem;
  background-color: #5b59fc;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #4a48e0;
  }
`;

const NotFoundPage = () => {
    const navigate = useNavigate();
    const error = useRouteError();

    let errorMessage = "페이지를 찾을 수 없습니다.";
    let statusCode = 404;

    if (isRouteErrorResponse(error)) {
        statusCode = error.status;
        errorMessage = error.statusText || errorMessage;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }

    const handleGoHome = () => {
        navigate("/");
    };

    return (
        <ErrorContainer>
            <ErrorCode>{statusCode}</ErrorCode>
            <ErrorTitle>페이지를 찾을 수 없습니다</ErrorTitle>
            <ErrorMessage>{errorMessage}</ErrorMessage>
            <HomeButton onClick={handleGoHome}>홈으로 돌아가기</HomeButton>
        </ErrorContainer>
    );
};

export default NotFoundPage;

