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
              alt="source-mri"
            />
          </div>
        ) : (
          <div className="upload-empty">
            <div className="upload-empty-icon-wrap">
              <Upload className="upload-empty-icon" />
            </div>
            <p className="upload-empty-title">{'\u4e0a\u4f20\u6e90 MRI \u56fe\u50cf'}</p>
            <p className="upload-empty-hint">{'\u652f\u6301 JPG\u3001PNG\u3001DICOM\u3001NII'}</p>
          </div>
        )}
      </div>
    </div>
  );
};
