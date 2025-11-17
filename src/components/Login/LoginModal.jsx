import React, { useEffect, useState } from "react";
import * as S from "./style";
import Modal from "react-modal";
import { API } from "../../api/axios";
import { supabase } from "../../supabaseClient";
// 이미지
import MainLogoImg from "../../assets/images/main-logo.svg";

export default function LoginModal({ onSuccess }) {
  // 임시
  const [isLogin, setIsLogin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(true);

  const fetchUserData = async () => {
    try {
      const response = await API.get(`api/pnd/user/profile`);
      const userInfo = {
        name: response.data.data.name,
        email: response.data.data.email,
        image: response.data.data.image,
        totalDocs: response.data.data.totalDocs,
        totalReadmes: response.data.data.totalReadmes,
        totalDiagrams: response.data.data.totalDiagrams,
        totalReports: response.data.data.totalReports,
      };
      sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
      // const testInfo = sessionStorage.getItem('userInfo');
      // const parsedUserInfo = JSON.parse(testInfo);
      // console.log(typeof(parsedUserInfo.name));
    } catch (error) {
      console.error(error);
    }
  };

  // 깃허브 로그인
  async function signInWithGithub() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}`,
        },
      });

      if (error) {
        console.error("GitHub 로그인 오류:", error);
        alert("로그인에 실패했습니다. 다시 시도해주세요.");
        return;
      }
    } catch (err) {
      alert("로그인 처리 중 오류가 발생했습니다.");
    }
  }

  return (
    <Modal
      isOpen={modalOpen}
      //onRequestClose={handleCancleBtn}
      ariaHideApp={false}
      parentSelector={() => document.body}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100vh",
          zIndex: "1000",
          position: "fixed",
          top: "0",
          left: "0",
        },
        content: {
          background: "white",
          border: "2px solid",
          borderRadius: "22px",
          padding: "10px",
          zIndex: "1100",
          position: "absolute",
          width: "26vw", // 기본 너비 설정
          height: "60vh", // 기본 높이 설정
          maxWidth: "100%", // 최대 너비 제한
          maxHeight: "100%", // 최대 높이 제한
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          top: "20%",
          left: "40%",
          overflow: "hidden", // 스크롤 제거
        },
      }}
    >
      <S.LoginContainer>
        <S.LoginModal>
          <S.LogoImg src={MainLogoImg} />
          <S.LoginMessage>
            로그인이 필요한 기능입니다.
            <br />
            로그인 하시겠습니까?
          </S.LoginMessage>
          <S.LoginButton onClick={signInWithGithub}></S.LoginButton>
          <S.LoginBottomText>
            깃허브로 로그인을 하고
            <br />
            P-ND의 더 많은 서비스를 사용해보세요!
          </S.LoginBottomText>
        </S.LoginModal>
      </S.LoginContainer>
    </Modal>
  );
}
