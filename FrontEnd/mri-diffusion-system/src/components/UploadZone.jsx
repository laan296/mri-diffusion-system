import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { useStore } from '../store/useStore';

export const UploadZone = () => {
  const { sourceImage, setSourceImage, zoomScale } = useStore();

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setSourceImage(previewUrl, file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.dcm', '.nii'],
    },
    multiple: false,
  });

  return (
    <div className="viewer-shell">
      <div
        {...getRootProps()}
        className={`upload-dropzone ${
          isDragActive ? 'upload-dropzone-active' : 'upload-dropzone-idle'
        }`}
      >
        <input {...getInputProps()} />

        {sourceImage ? (
          <div className="image-stage">
            <img
              src={sourceImage}
              style={{ transform: `scale(${zoomScale})` }}
              className="image-preview"
              alt="Source MRI"
            />
          </div>
        ) : (
          <div className="upload-empty group">
            <div className="upload-empty-icon-wrap">
              <div className="upload-empty-glow" />
              <Upload className="upload-empty-icon" />
            </div>
            <p className="upload-empty-title">点击或拖拽上传图像</p>
            <p className="upload-empty-hint">SUPPORTS JPG, PNG, DICOM, NII</p>
          </div>
        )}
      </div>
    </div>
  );
};
