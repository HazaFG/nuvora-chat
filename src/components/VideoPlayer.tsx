// src/components/VideoPlayer.tsx
"use client";

import React, { useRef, useEffect } from 'react'; // Asegúrate de importar useEffect y useRef

interface VideoPlayerProps {
  src: string;
  play: boolean;
  onFinish: () => void;
  className?: string;
}

export default function VideoPlayer(props: VideoPlayerProps) {
  const src = `data:video/mp4;base64,${props.src}`;
  const videoRef = useRef<HTMLVideoElement>(null); // Ref para controlar el elemento de video

  useEffect(() => {
    if (videoRef.current) {
      if (props.play) {
        videoRef.current.play().catch(e => console.error("Error al reproducir video:", e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [props.play]);

  return (
    <div className={`flex flex-col items-center gap-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 w-[340px] max-w-full mx-auto shadow-sm ${props.className || ''}`}>
      <video
        ref={videoRef}
        controls
        preload="metadata"
        className="rounded-md w-full h-auto"
        onEnded={props.onFinish}
      >
        <source src={src} type="video/mp4" />
        Tu navegador no soporta el video.
      </video>
    </div>
  );
}
