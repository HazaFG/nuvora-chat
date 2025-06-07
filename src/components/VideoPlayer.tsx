"use client";
export default function VideoPlayer(props: any) {
  const src = `data:video/mp4;base64,${props.src}`;

  return (
    <div className="flex flex-col items-center gap-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 w-[340px] max-w-full mx-auto shadow-sm">
      <video
        controls
        preload="metadata"
        className="rounded-md w-full h-auto"
      >
        <source src={src} type="video/mp4" />
        Tu navegador no soporta el video.
      </video>
    </div>
  );
}

