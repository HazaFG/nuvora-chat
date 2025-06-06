// MediaDisplay.tsx
import Image from "next/image";
import { useState } from "react";
import AudioPlayer from "./AudioPlayer";
import VideoPlayer from "./VideoPlayer";

interface Props {
  media: string;
  mimeType: string;
}

export default function MediaDisplay({ media, mimeType }: Props) {
  const [playSubmitSound, setPlaySubmitSound] = useState(false);

  switch (mimeType) {
    case "video":
      return (
        <VideoPlayer
          src={media}
          play={playSubmitSound}
          onFinish={() => setPlaySubmitSound(false)}
          className="w-full h-auto rounded-md"
        />
      );
    case "audio":
      return (
        <AudioPlayer
          src={media}
          play={playSubmitSound}
          onFinish={() => setPlaySubmitSound(false)}
        />
      );
    case "image":
      return (
        <Image
          src={`data:image/jpg;base64,${media}`}
          alt="Contenido multimedia"
          className="w-full h-auto object-contain rounded-md"
          width={1} // Mínimo para Next.js Image
          height={1} // Mínimo para Next.js Image
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 50vw"
          style={{ width: '100%', height: 'auto' }}
        />
      );
    default:
      return null;
  }
}
