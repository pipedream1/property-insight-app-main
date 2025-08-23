
import { useState } from 'react';
import { useCameraInitialization } from './useCameraInitialization';
import { useImageCapture } from './useImageCapture';
import { useFileUpload } from './useFileUpload';

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  streamRef: React.RefObject<MediaStream | null>;
  isUploading: boolean;
  uploadProgress: number;
  showCamera: boolean;
  handleCameraCapture: () => Promise<void>;
  takePicture: () => Promise<void>;
  stopCamera: () => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isMobile: boolean;
}

export const useCamera = (onImageCaptured: (imageUrl: string) => void): UseCameraReturn => {
  const {
    videoRef,
    streamRef,
    showCamera,
    setShowCamera,
    initializeCamera,
    stopCamera,
    isMobile
  } = useCameraInitialization();

  const {
    isUploading: captureUploading,
    uploadProgress: captureProgress,
    takePicture
  } = useImageCapture({
    videoRef,
    streamRef,
    stopCamera,
    onImageCaptured
  });

  const {
    isUploading: fileUploading,
    uploadProgress: fileProgress,
    fileInputRef,
    handleFileUpload
  } = useFileUpload({
    onImageCaptured
  });

  // Combine uploading states
  const isUploading = captureUploading || fileUploading;
  
  // Use the relevant progress value
  const uploadProgress = captureUploading ? captureProgress : fileProgress;

  const handleCameraCapture = async () => {
    setShowCamera(true);
    await initializeCamera();
  };

  return {
    videoRef,
    streamRef,
    isUploading,
    uploadProgress,
    showCamera,
    handleCameraCapture,
    takePicture,
    stopCamera,
    handleFileUpload,
    fileInputRef,
    isMobile
  };
};
