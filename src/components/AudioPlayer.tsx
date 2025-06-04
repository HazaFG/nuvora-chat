import { useRef, useEffect } from "react";

export default function AudioPlayer(props: any) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (props.play) {
      playAudio();
    }
  }, [props.play]);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleAudioEnded = () => {
    // Call the callback function when the audio ends
    if (props.onFinish) {
      props.onFinish();
    }
  };

  return (
    <div>
      <audio ref={audioRef} controls onEnded={handleAudioEnded}>
        <source src={`data:audio/mp3;base64,${props.src}`} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
