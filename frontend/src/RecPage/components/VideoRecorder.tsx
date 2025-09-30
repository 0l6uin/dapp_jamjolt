// src/components/VideoRecorder.tsx
import React, { useEffect, useRef, useState } from "react";

interface VideoRecorderProps {
  attemptsLeft: number;
  maxRecordingTime: number;
  onStop: (blob: Blob) => void; // callback cuando termina la grabación
}

export default function VideoRecorder({ attemptsLeft, maxRecordingTime, onStop }: VideoRecorderProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Inicializa la cámara
  useEffect(() => {
    async function setupCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    }
    setupCamera();
  }, []);

  // Countdown de 3 segundos antes de grabar
  const startCountdown = () => {
    let counter = 3;
    setCountdown(counter);
    const interval = setInterval(() => {
      counter--;
      if (counter === 0) {
        clearInterval(interval);
        setCountdown(null);
        startRecording();
      } else {
        setCountdown(counter);
      }
    }, 1000);
  };

  // Inicia la grabación
  const startRecording = () => {
    if (!stream || attemptsLeft <= 0) return;

    setRecordedBlob(null); // limpia grabación previa
    const recorder = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      setRecordedBlob(blob);
      onStop(blob); // avisa al padre que terminó la grabación
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
    setRecording(true);

    // auto-stop a los X segundos
    setTimeout(() => stopRecording(), maxRecordingTime);
  };

  // Detiene la grabación
  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div style={{ flex: 1 }}>
      {/* Cámara si aún no se grabó */}
      {!recordedBlob && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ width: "100%", border: "2px solid black" }}
        />
      )}

      {/* Preview si ya se grabó */}
      {recordedBlob && (
        <div style={{ marginTop: "20px" }}>
          <h3>Preview:</h3>
          <video
            src={URL.createObjectURL(recordedBlob)}
            controls
            style={{ width: "100%" }}
          />
        </div>
      )}

      {countdown && <h1>{countdown}</h1>}

      {/* Controles */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          marginTop: "10px",
        }}
      >
        <button disabled={recording || attemptsLeft <= 0} onClick={startCountdown}>
          🎤 Record
        </button>
        <button disabled={!recording} onClick={stopRecording}>
          ⏹ Stop
        </button>
      </div>
    </div>
  );
}