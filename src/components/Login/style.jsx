import styled from "styled-components";
import LoginButtonImg from "../../assets/images/login-button.svg";

export const LoginContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2vw;
  box-sizing: border-box;
`;

export const LoginModal = styled.div`
  width: 40%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  border-radius: 2vw;
  padding-bottom: 4vh;
  background-color: white;
  border: 2px solid #e0e0e0;
  box-sizing: border-box;
  overflow: visible;
`;

// '로그인하시겠습니까?' 텍스트
export const LoginMessage = styled.div`
  color: black;
  text-align: center;
  font-family: Inter;
  font-size: 1.2rem;
  font-style: normal;
  font-weight: 600;
  line-height: 32px; /* 133.333% */
  margin-top: 2.8vh;
  margin-bottom: 3.5vh;
`;

export const LogoImg = styled.img`
  margin-top: 5vh;
  max-width: 100%;
  height: 12vh; // 로고 이미지를 원본 비율로 유지
`;

export const LoginButton = styled.button`
  background-image: url(${LoginButtonImg});
  background-size: contain; // 이미지가 버튼 크기에 맞게 조정되도록
  background-position: center;
  background-repeat: no-repeat;
  width: 90%; // 버튼의 너비를 부모 요소에 90
  height: 15vh; // 버튼의 세로 길이를 15%로 설정
  border: none; // 버튼 테두리를 없앰
  cursor: pointer; // 마우스를 올렸을 때 포인터로 변경
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box; // 패딩 및 보더를 포함하여 버튼 크기 계산
  object-fit: contain;
  margin-top: 3vh;
  margin-bottom: 2vh;
`;

export const LoginBottomText = styled.div`
  margin-top: 1vh;
  margin-bottom: 2vh;
  font-size: 0.9rem;
  line-height: 1.5;
  text-align: center;
`;

export const InputContainer = styled.div`
  width: 90%;
  margin-bottom: 2vh;
  display: flex;
  flex-direction: column;
`;

export const InputLabel = styled.label`
  color: black;
  font-family: Inter;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5vh;
`;

export const InputField = styled.input`
  width: 100%;
  padding: 1vh 1vw;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  font-family: Inter;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }

  &::placeholder {
    color: #a0a0a0;
  }
`;

export const PasswordInputWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;

  ${InputField} {
    padding-right: 3.5vw;
  }
`;

export const PasswordToggleButton = styled.button`
  position: absolute;
  right: 1vw;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: color 0.2s;

  &:hover {
    color: #4a90e2;
  }

  &:focus {
    outline: none;
  }
`;

export const EyeIcon = styled.svg`
  width: 20px;
  height: 20px;
  color: currentColor;
`;

export const EyeOffIcon = styled.svg`
  width: 20px;
  height: 20px;
  color: currentColor;
`;

export const SubmitButton = styled.button`
  width: 90%;
  padding: 1.2vh 1vw;
  margin-top: 2vh;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  font-family: Inter;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  box-sizing: border-box;

  &:hover {
    background-color: #357abd;
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.3);
  }

  &:disabled {
    background-color: #d0d0d0;
    cursor: not-allowed;
    transform: none;
  }
`;
