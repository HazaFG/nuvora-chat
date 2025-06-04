import Image from "next/image"
import Audio from "next/Audio"
import { useState } from "react";
import AudioPlayer from "./AudioPlayer";

interface Props {
  media: string
  mimeType: string
}

export default function MediaDisplay({ media, mimeType }: Props) {
  const [playSubmitSound, setPlaySubmitSound] = useState(false);
  console.log(mimeType)
  switch (mimeType) {
    case "video":
      return (
        <span>toodo!</span>
      )
      break;
    case "audio":
      return (
        <AudioPlayer
          src={media}
          play={playSubmitSound}
          onFinish={() => setPlaySubmitSound(false)}
        />
      )
      break;
    default:
      return (
        <Image src={`data:image/jpg;base64,${media}`} width={40} height={20} className="me-3" alt="Flowbite Logo" />
      )
      break;
  }
}
