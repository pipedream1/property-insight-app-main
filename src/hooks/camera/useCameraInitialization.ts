
import { toast } from 'sonner';
import { useRef, useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface UseCameraInitializationReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  streamRef: React.RefObject<MediaStream | null>;
  showCamera: boolean;
  setShowCamera: (show: boolean) => void;
  initializeCamera: () => Promise<void>;
  stopCamera: () => void;
  isMobile: boolean;
}

export const useCameraInitialization = (): UseCameraInitializationReturn => {
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isMobile = useIsMobile();

  // Ensure proper cleanup of camera resources
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const initializeCamera = async (): Promise<void> => {
    try {
      console.log("Initializing camera...");
      console.log("Device is mobile:", isMobile);
      
      // First try to detect if this is iOS
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      console.log("Device is iOS:", isIOS);
      
      // For mobile devices, explicitly try to use the back camera with higher quality
      if (isMobile) {
        try {
          console.log("Accessing rear camera on mobile device with high quality...");
          const mobileConstraints: MediaStreamConstraints = {
            video: {
              facingMode: { exact: "environment" }, // Force back camera
              width: { ideal: 1920 },
              height: { ideal: 1080 }
            },
            audio: false
          };
          
          try {
            const stream = await navigator.mediaDevices.getUserMedia(mobileConstraints);
            streamRef.current = stream;
            console.log("Successfully accessed rear camera with high quality");
          } catch (err) {
            console.log('Could not access rear camera with exact mode, trying ideal mode');
            // Try with less strict constraints
            const fallbackConstraints: MediaStreamConstraints = {
              video: {
                facingMode: { ideal: "environment" }, // Prefer back camera
                width: { ideal: 1280 },
                height: { ideal: 720 }
              },
              audio: false
            };
            
            const stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
            streamRef.current = stream;
            console.log("Successfully accessed camera with fallback constraints");
          }
        } catch (err) {
          console.log('Could not access specific camera, trying any camera', err);
          // Fall back to any available camera
          const fallbackStream = await navigator.mediaDevices.getUserMedia({ 
            video: true,
            audio: false
          });
          streamRef.current = fallbackStream;
          console.log("Camera accessed with basic fallback");
        }
      } else {
        // For desktop devices
        console.log("Accessing camera on desktop device...");
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false 
        });
        streamRef.current = stream;
        console.log("Camera accessed on desktop");
      }
      
      if (videoRef.current && streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
        console.log("Video source set, waiting for metadata to load");
        
        // Wait for the video to be ready
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            console.log("Video metadata loaded, starting playback");
            videoRef.current.play().catch(err => {
              console.error('Error playing video:', err);
              toast.error('Could not start video stream');
            });
          }
        };
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      toast.error('Could not access camera. Please check permissions.');
      setShowCamera(false);
    }
  };

  const stopCamera = (): void => {
    console.log("Stopping camera...");
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        console.log(`Stopping track: ${track.kind}`);
        track.stop();
      });
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  return {
    videoRef,
    streamRef,
    showCamera,
    setShowCamera,
    initializeCamera,
    stopCamera,
    isMobile
  };
};
