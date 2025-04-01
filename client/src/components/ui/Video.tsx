import { useEffect, useRef } from "react";

export default function VideoComponent({ videoSrc }: { videoSrc: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoEnd = () => {
      setTimeout(() => {
        if (video) {
          video.currentTime = 0; 
          video.play(); 
        }
      }, 3000); 
    };

    video.addEventListener("ended", handleVideoEnd);
    return () => video.removeEventListener("ended", handleVideoEnd);
  }, []);

  return (
    <video ref={videoRef} autoPlay muted width="100%" height="100%">
      <source src={videoSrc} type="video/mp4" />
    </video>
  );
}
