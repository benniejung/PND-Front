import React, { useState } from 'react';
import {PreviewLabel,
    HiddenFileInput,
    Icon,
    PreviewMessage,
    PreviewDescription,
    PreviewInfo,
    PreviewImage,
    AddImageButton} from './FileUploadDNDStyle';


const FileInfo = ({ uploadedInfo }) => (
  <PreviewInfo>
    <PreviewImage src={uploadedInfo.imageUrl} alt={uploadedInfo.name} />
  </PreviewInfo>
);

const Logo = () => (
  <Icon x="0px" y="0px" viewBox="0 0 24 24">
    <path fill="transparent" d="M0,0h24v24H0V0z" />
    <path
      fill="#000"
      d="M20.5,5.2l-1.4-1.7C18.9,3.2,18.5,3,18,3H6C5.5,3,5.1,3.2,4.8,3.5L3.5,5.2C3.2,5.6,3,6,3,6.5V19  c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V6.5C21,6,20.8,5.6,20.5,5.2z M12,17.5L6.5,12H10v-2h4v2h3.5L12,17.5z M5.1,5l0.8-1h12l0.9,1  H5.1z"
    />
  </Icon>
);

const UploadBox = ({ onImageAdd }) => {
  const [isActive, setActive] = useState(false);
  const [uploadedInfo, setUploadedInfo] = useState(null);

  const setFileInfo = (file) => {
    const { name, type } = file;
    const isImage = type.includes('image');
    const size = (file.size / (1024 * 1024)).toFixed(2) + 'MB';

    if (!isImage) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedInfo({ name, size, type, imageUrl: String(reader.result) });
    };
    reader.readAsDataURL(file);
  };

  const handleDragStart = () => setActive(true);
  const handleDragEnd = () => setActive(false);
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleUpload = ({ target }) => {
    const file = target.files[0];
    setFileInfo(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setFileInfo(file);
    setActive(false);
  };

  const handleAddImage = () => {
    if (uploadedInfo) {
      const markdown = `!(${uploadedInfo.imageUrl})`;
      onImageAdd(markdown);
    }
  };

  return (
    <div>
      <PreviewLabel
        className={isActive ? 'active' : ''}
        onDragEnter={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragEnd}
        onDrop={handleDrop}
      >
        <HiddenFileInput type="file" onChange={handleUpload} />
        <Logo />
        <PreviewMessage>클릭 혹은 파일을 이곳에 드롭하세요.</PreviewMessage>
        <PreviewDescription>파일당 최대 3MB</PreviewDescription>
      </PreviewLabel>
      {uploadedInfo && <FileInfo uploadedInfo={uploadedInfo} />}
      {uploadedInfo && (
        <AddImageButton onClick={handleAddImage}>
          생성하기
        </AddImageButton>
      )}
    </div>
  );
};

export default UploadBox;
