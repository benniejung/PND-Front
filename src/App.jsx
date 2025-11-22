import { styled, ThemeProvider } from "styled-components";
import { GlobalStyle } from "./style/globalStyle";
import { theme } from "./style/theme.js";
import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

import Header from "./components/header/Header.jsx";
// 전체 레이아웃 크기 고정
const BackGroundColor = styled.div`
  width: 100vw; /* 전체 너비 고정 */
  //height: ${(props) => props.isReadme || (props.isEmpty && "100vh")};
  min-height: 100vh;
  background-color: #f8f8ff;
  position: relative;
  display: flex;
  flex-direction: column;
  //overflow: hidden; /* 스크롤 방지 */
`;

// 콘텐츠 영역 설정
const Content = styled.div`
  flex-grow: 1; /* 헤더와 푸터를 제외한 모든 공간을 차지 */
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  //justify-content: center; /* 컨텐츠를 수직으로도 중앙에 배치 */
`;

const Layout = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isEmpty, setIsEmpty] = useState(false); // isEmpty 상태 추가

  // 현재 경로가 /readme이면 height를 100vh로 설정
  const isReadme = currentPath === "/readme";

  return (
    <BackGroundColor isReadme={isReadme} isEmpty={isEmpty}>
      <Header />
      <Content>
        <Outlet context={{ isEmpty, setIsEmpty }} />
      </Content>
    </BackGroundColor>
  );
};

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Layout />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#4ade80",
                secondary: "#fff",
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </ThemeProvider>
    </>
  );
}

export default App;
