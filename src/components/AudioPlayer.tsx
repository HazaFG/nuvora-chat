import { useRef, useEffect, useState, useCallback } from "react";
import { IoPlay, IoPause, IoVolumeHigh, IoVolumeMute } from "react-icons/io5";

interface AudioPlayerProps {
  src: string;
  play: boolean;
  onFinish: () => void;
}

export default function AudioPlayer({ src, play, onFinish }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Efecto para controlar la reproducción externa (si la prop 'play' cambia)
  useEffect(() => {
    if (audioRef.current) {
      if (play) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.error("Error playing audio:", e));
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [play]);

  // Manejadores de eventos del audio
  const handlePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      setCurrentTime(current);
      setDuration(dur);
      if (dur > 0) {
        setProgress((current / dur) * 100);
      }
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    if (onFinish) {
      onFinish();
    }
  }, [onFinish]);

  const handleProgressBarClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && audioRef.current) {
      const clickX = e.nativeEvent.offsetX;
      const width = progressBarRef.current.offsetWidth;
      const clickRatio = clickX / width;
      audioRef.current.currentTime = clickRatio * duration;
    }
  }, [duration]);

  const handleToggleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  }, []);

  // Formatear el tiempo para mostrarlo (mm:ss)
  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 w-64 max-w-full mx-auto shadow-sm">
      {/* Elemento de audio real (oculto) */}
      <audio
        ref={audioRef}
        src={`data:audio/mp3;base64,${src}`} // Usa src directamente si ya es la URL/base64
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        className="hidden" // Ocultamos el reproductor nativo
      >
        Your browser does not support the audio element.
      </audio>

      {/* Controles personalizados */}
      <div className="flex items-center w-full gap-2">
        {/* Botón de Play/Pause */}
        <button
          onClick={handlePlayPause}
          className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 text-xl flex-shrink-0"
          aria-label={isPlaying ? "Pausar audio" : "Reproducir audio"}
        >
          {isPlaying ? <IoPause /> : <IoPlay />}
        </button>

        {/* Barra de progreso */}
        <div
          ref={progressBarRef}
          className="flex-1 h-2 bg-gray-300 dark:bg-gray-600 rounded-full cursor-pointer overflow-hidden relative"
          onClick={handleProgressBarClick}
          aria-label="Barra de progreso del audio"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Tiempo actual y duración + Control de volumen */}
      <div className="flex justify-between items-center w-full text-xs text-gray-600 dark:text-gray-300">
        <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
        <button
          onClick={handleToggleMute}
          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 text-base"
          aria-label={isMuted ? "Activar sonido" : "Silenciar sonido"}
        >
          {isMuted ? <IoVolumeMute /> : <IoVolumeHigh />}
        </button>
      </div>
    </div>
  );
}
