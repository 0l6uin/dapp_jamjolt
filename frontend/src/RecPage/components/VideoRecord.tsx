import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const MAX_ATTEMPTS = 3;
const MAX_RECORDING_TIME = 30_000; // 30 seconds
const MUSIC_URL = "/TrainPage/assets/music.mp3";

export default function RecordingPage() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);

  useEffect(() => {
    async function setupCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
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

  const startRecording = () => {
    if (!stream || attemptsLeft <= 0) return;

    const recorder = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      setRecordedBlob(blob);
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
    setRecording(true);

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }

    setTimeout(() => stopRecording(), MAX_RECORDING_TIME);
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    setRecording(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setAttemptsLeft((prev) => prev - 1);
  };

  const renewAttempts = () => {
    setAttemptsLeft(MAX_ATTEMPTS);
  };

  const goToReview = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      navigate("/review", { state: { videoUrl: url } });
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Karaoke Recording</h2>

      <video ref={videoRef} autoPlay playsInline style={{ width: "400px", border: "2px solid black" }} />

      {countdown && <h1>{countdown}</h1>}

      <div style={{ marginTop: "20px" }}>
        <button disabled={recording || attemptsLeft <= 0} onClick={startCountdown}>
          🎤 Record
        </button>
        <button disabled={!recording} onClick={stopRecording}>
          ⏹ Stop
        </button>
      </div>

      <p>Attempts left: {attemptsLeft}</p>
      <button onClick={renewAttempts}>Renew Attempts</button>

      <audio ref={audioRef} src={MUSIC_URL} />

      {recordedBlob && (
        <div style={{ marginTop: "20px" }}>
          <h3>Preview:</h3>
          <video src={URL.createObjectURL(recordedBlob)} controls style={{ width: "300px" }} />
          <br />
          <button onClick={goToReview}>Next ➡</button>
        </div>
      )}
    </div>
  );
}
