// src/components/VideoRecorder.tsx
import React, { useEffect, useRef, useState } from "react";

interface Props {
  attemptsLeft: number;
  maxRecordingTime: number;
  onStop: (blob: Blob) => void;
  onStartRecording: (startFn: () => void) => void;
  showCountdown: boolean;
  countdown: number;
  audioRef?: React.RefObject<HTMLAudioElement>;
}

export default function VideoRecorder({
  attemptsLeft,
  maxRecordingTime,
  onStop,
  onStartRecording,
  showCountdown,
  countdown
}: Props) {
  const [recording, setRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks: BlobPart[] = [];

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      if (videoRef.current) videoRef.current.srcObject = stream;
    });
  }, []);

  const startRecording = async () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    mediaRecorder.current = new MediaRecorder(stream);
    mediaRecorder.current.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.current.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      onStop(blob);
    };
    mediaRecorder.current.start();
    setRecording(true);
    setTimeout(stopRecording, maxRecordingTime);
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setRecording(false);
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      <video ref={videoRef} autoPlay muted className="rounded-xl shadow-lg w-[320px] h-[240px]" />

      {/* Contador visible */}
      {showCountdown && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-6xl font-bold">
          {countdown}
        </div>
      )}

      <div className="mt-4 flex gap-3">
        <button
          disabled={recording || attemptsLeft <= 0}
          onClick={() => onStartRecording(startRecording)}
          className="bg-green-500 text-white px-4 py-2 rounded-xl"
        >
          Record
        </button>
        <button
          disabled={!recording}
          onClick={stopRecording}
          className="bg-red-500 text-white px-4 py-2 rounded-xl"
        >
          Stop
        </button>
        <p>Attempts left: {attemptsLeft}</p>
      </div>
    </div>
  );
}