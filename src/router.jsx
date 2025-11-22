import { createBrowserRouter } from "react-router-dom";
import App from "./App";

// Pages
import Main from "./pages/main/Main";
import MyProjects from "./pages/myproject/MyProjects";
import ReadMe from "./pages/readme/Readme";
import Retro from "./pages/retro/Retro";
import Team from "./pages/Team/Team";
import LoginModal from "./components/Login/LoginModal";
import Report from "./pages/report/Report";
import Diagram from "./pages/diagram/Diagram";

import ClassDiagram from "./pages/diagram/ClassDiagram";
import SequenceDiagram from "./pages/diagram/SequenceDiagram";
import ErdDiagram from "./pages/diagram/ErdDiagram";

import MyPageREADME from "./pages/myproject/MyPageREADME/MyPageREADME";
import MyPageClassDiagram from "./pages/myproject/MyPageClassDiagram/MyPageClassDiagram";
import MyPageERD from "./pages/myproject/MyPageERD/MyPageERD";
import MyPageGithubReport from "./pages/myproject/MyPageGithubReport/MyPageGithubReport";
import MyPageSequenceDiagram from "./pages/myproject/MyPageSequenceDiagram/MyPageSequenceDiagram";
import LoginError from "./components/Common/error/LoginError";
import LoginPage from "./pages/login/LoginPage";
import SignupPage from "./pages/signup/SignupPage";
import ErrorPage from "./pages/error/ErrorPage";
import NotFoundPage from "./pages/error/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Main />,
      },

      {
        path: "readme",
        element: <ReadMe />,
      },
      {
        path: "retro",
        element: <Retro />,
      },
      {
        path: "myProjects",
        element: <MyProjects />,
      },
      {
        path: "team",
        element: <Team />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignupPage />,
      },
      {
        path: "login-error",
        element: <LoginError />,
      },
      {
        path: "report",
        element: <Report />,
      },
      {
        path: "diagram",
        element: <Diagram />,
        children: [
          {
            path: "class",
            element: <ClassDiagram />,
          },
          {
            path: "sequence",
            element: <SequenceDiagram />,
          },
          {
            path: "erd",
            element: <ErdDiagram />,
          },
        ],
      },
      {
        path: "mypageREADME",
        element: <MyPageREADME />,
      },
      {
        path: "mypageClassDiagram",
        element: <MyPageClassDiagram />,
      },
      {
        path: "mypageSequenceDiagram",
        element: <MyPageSequenceDiagram />,
      },
      {
        path: "mypageERD",
        element: <MyPageERD />,
      },
      {
        path: "mypageGithubReport",
        element: <MyPageGithubReport />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
