import React, { useState, useEffect } from 'react';
import { PageContainer, Header, NavItem, NavMenu, ButtonGroup, EditButton, SaveButton, Title, ContentArea, Divider, DiagramResultBox } from '../Styles/MyPageStyles';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Download from '../Download';
import RepoSettingModalForMyPage from '../../../components/Common/RepoSettingModalForMyPage';
import { API } from '../../../api/axios';
import mermaid from 'mermaid';
import ViewCode from '../../../components/Diagram/ViewCode.jsx';

const MyPageClassDiagram = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [classDiagramContent, setClassDiagramContent] = useState(''); 
  const [isSelectedProject, setIsSelectedProject] = useState(false); 
  const [error, setError] = useState('');
  const [repoId,setRepoId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleButtonClick = (type) => {
    if (type === 'save') {
      downloadDiagram();
    } else if (type === 'edit') {
      navigate(`/diagram/class?edit=${repoId}&type=class`);
    }
  };

  const fetchUserClassDiagram = async (repoId) => {
    try {
      const requestStr = `api/pnd/diagram/class?repoId=${repoId}`;
      console.log(requestStr);
      const response = await API.get(requestStr);
      if(response.data.data===null){
        setClassDiagramContent(null);
      }
      setClassDiagramContent(response.data.data);
      setError(null); 
    } catch (error) {
      console.log(error)
      setClassDiagramContent('오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    const renderDiagram = () => {
      if(classDiagramContent === null){
        const diagramContainer = document.getElementById("diagram-container");
        diagramContainer.innerHTML= '<h2> 생성되어 있는 Class 다이어그램이 존재하지 않습니다. </h2>';
      }
      if (!classDiagramContent || !classDiagramContent.trim()) return;

      let data = classDiagramContent;
      data = data.replace(/^```|```$/g, '');

      const diagramContainer = document.getElementById("diagram-container");
      if (diagramContainer) {
        
        diagramContainer.innerHTML = `<div class="mermaid" style="width: 100%; height: 100%;">${data}</div>`;
        
        try {
          mermaid.init(undefined, diagramContainer.querySelector('.mermaid'));
    
          setTimeout(() => {
            const svgElement = diagramContainer.querySelector("svg");
            if (svgElement) {
              svgElement.setAttribute('style', 'width: 100%; height: 100%; max-width: none !important;');
            }
          }, 1); // 1ms 지연
            } catch (error) {
          console.error("Mermaid rendering error:", error);
        }
      }
    };

    renderDiagram(); 
  }, [classDiagramContent]); 

  useEffect(() => {
    const sessionRepoId = sessionStorage.getItem('repoId');
    if(sessionRepoId!==null){
      setRepoId(sessionRepoId);
      fetchUserClassDiagram(sessionRepoId);
    }
    else{
    setIsModalOpen(true);
    }
  }, []);

  const downloadDiagram = () => {
    const repoTitle = sessionStorage.getItem('repoTitle');
    const diagramContainer = document.getElementById("diagram-container");    
    const svgElement = diagramContainer.querySelector("svg");
    
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      
      const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${repoTitle}_class_diagram.svg`; 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);  
    } 
  };
    
  const closeDownloadModal = () => setIsDownloadModalOpen(false);

  return (
    <PageContainer>
      <Helmet>
        <link href="https://fonts.googleapis.com/css2?family=Edu+QLD+Beginner&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet" />
      </Helmet>
      <Header>
        <NavMenu>
          <NavItem to='/mypageReadme' isActive={location.pathname === '/mypagereadme'}>README</NavItem>
          <Divider />
          <NavItem to='/mypageClassDiagram' isActive={location.pathname === '/mypageClassDiagram'}>
            CLASS DIAGRAM
          </NavItem>
          <Divider />
          <NavItem to='/mypageSequenceDiagram' isActive={location.pathname === '/mypageSequenceDiagram'}> SEQUENCE DIAGRAM</NavItem>
          <Divider />
          <NavItem to='/mypageERD' isActive={location.pathname === '/mypageERD'}>ERD</NavItem>
          <Divider />
          <NavItem to='/mypageGithubReport' isActive={location.pathname === '/mypageGithubReport'}>GITHUB REPORT</NavItem>
        </NavMenu>
        <ButtonGroup>
          <EditButton onClick={() => handleButtonClick('edit')}>수정하기</EditButton>
          <SaveButton onClick={() => handleButtonClick('save')}>저장하기</SaveButton>
        </ButtonGroup>
      </Header>
      <Title>CLASS DIAGRAM</Title>
      <ContentArea>
        <DiagramResultBox>
          {error ? error : (
            <div id="diagram-container" style={{width : '100%'}}>Class Diagram을 로드 중입니다...</div>
          )}
        </DiagramResultBox>
      </ContentArea>
      {isDownloadModalOpen && (
        <Download closeModal={closeDownloadModal} />
      )}
      {isModalOpen && (
        <RepoSettingModalForMyPage
          closeModal={() => setIsModalOpen(false)}
          onSelectProject={() => setIsSelectedProject(true)}
          onSelectedProjectId={(id) => {
            setSelectedProjectId(id);
            fetchUserClassDiagram(id); 
          }}
        />
      )}
    </PageContainer>
  );
};

export default MyPageClassDiagram;
