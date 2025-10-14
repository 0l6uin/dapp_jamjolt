import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import RenewAttempts from './components/RenewAttempts';
import SignIn from './components/SignIn';
import VideoRecorder from "./components/VideoRecorder"
import { Container, Button, Nav } from './styles/RecPage';
import musicFile from '../TrainPage/assets/music.mp3';
import { 
  LyricBox,
  ActiveLine,
  DefaultLine
} from '../TrainPage/styles/TrainPage.style';

type AuthResult = {
  accessToken: string,
  user: {
    uid: string;
    username: string
  }
};
export type User = AuthResult['user'];

// Backend Configuration
// Make TS accept the existence of our window.__ENV object - defined in index.html:
interface WindowWithEnv extends Window {
  __ENV?: {
    backendURL: string; // REACT_APP_BACKEND_URL environment variable
    sandbox: "true" | "false"; // REACT_APP_SANDBOX_SDK environment variable - string, not boolean!
  }
}

const _window: WindowWithEnv = window;
const backendURL = _window.__ENV?.backendURL;
const axiosClient = axios.create({ baseURL: backendURL, timeout: 20000, withCredentials: true});

// Constants
const MAX_ATTEMPTS = 2; // Maximum recording attempts
const MAX_RECORDING_TIME = 10000; // Maximum recording time (10 seconds)

// Lyric Section
interface Lyric {
  time: number;
  text: string;
}

 const lyrics: Lyric[] = [
  { time: 26, text: "..." },
  { time: 30, text: "It took me by surprise, I must say" },
  { time: 34, text: "When I found out yesterday" },
  { time: 38, text: "Ooh-ooh I heard it through the grapevine" },
  { time: 42, text: "Not much longer would you be mine" },
  { time: 46, text: "Ooh-ooh I heard it through the grapevine" },
  { time: 50, text: "And I'm just about to lose my mind" },
  { time: 54, text: "Honey, honey, yeah" },
];

export default function KARAOKE() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [showLyrics, setShowLyrics] = useState(true);
  const [activeLine, setActiveLine] = useState(-1);
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const audioRef = useRef<HTMLAudioElement>(new Audio(musicFile));

  // Sync lyrics with music
  useEffect(() => {
    const audio = audioRef.current;
    const updateLyrics = () => {
      const t = audio.currentTime;
      const idx = lyrics.findIndex((l, i) =>
        t >= l.time && (i === lyrics.length - 1 || t < lyrics[i + 1].time)
      );
      setActiveLine(idx);
    };
    audio.addEventListener("timeupdate", updateLyrics);
    return () => audio.removeEventListener("timeupdate", updateLyrics);
  }, []);

  const visibleLyrics = () => {
    if (activeLine === -1) return lyrics.slice(0, 1);
    return [lyrics[activeLine]];
  };

  // 🔹 When recording stops
  const handleStopRecording = (blob: Blob) => {
    setRecordedBlob(blob);
    setAttemptsLeft((a) => a - 1);
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
    setActiveLine(-1);
  };

  // Renew attempts (after Pi payment)
  const renewAttempts = () => setAttemptsLeft(MAX_ATTEMPTS);

  // Go to review
  const goToPost = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      navigate("/postpage", { state: { videoUrl: url } });
    }
  };

  // Auth with Pi
  const signIn = async () => {
    try {
      const scopes = ["username", "payments"];
      const auth: AuthResult = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
      setUser(auth.user);
      await axiosClient.post("/user/signin", { auth });
      setShowModal(false);
    } catch (err) {
      console.error("Auth error:", err);
    }
  };

  const onIncompletePaymentFound = (p: any) => axiosClient.post("/payments/incomplete", { p });

  // 🔹 Inicio sincronizado de grabación + música
  const handleStartRecording = async (startFn: () => void) => {
    if (!user) {
      setShowModal(true);
      return;
    }

    if (attemptsLeft <= 0) return alert("No attempts left!");

    // Mostrar cuenta regresiva
    setShowCountdown(true);
    setCountdown(3);

    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(countdownTimer);
          setShowCountdown(false);

          // ⏯️ Iniciar música y grabación al mismo tiempo
          const audio = audioRef.current;
          audio.currentTime = 26; // inicio del extracto
          audio.play();
          startFn();
        }
        return prev - 1;
      });
    }, 1000);
  };
/* 
const signOut = async () => {
    await axiosClient.get("/user/signout");
    setUser(null);
  };

  /// !!!
  // 🔹 Payment flow
  const orderProduct = async (memo: string, amount: number) => {
    if (!user) return setShowModal(true);
    const paymentData = { amount, memo, metadata: { productId: "attempts_to_record" } };
    const callbacks = { onReadyForServerApproval, onReadyForServerCompletion, onCancel, onError };
    await window.Pi.createPayment(paymentData, callbacks);
  };

  const onIncompletePaymentFound = (p: any) => axiosClient.post("/payments/incomplete", { p });
  const onReadyForServerApproval = (id: string) => axiosClient.post("/payments/approve", { id });
  const onReadyForServerCompletion = (id: string, txid: string) =>
    axiosClient.post("/payments/complete", { id, txid }).then(renewAttempts);
  const onCancel = (id: string) => axiosClient.post("/payments/cancel", { id });
  const onError = (err: Error) => console.error(err); */

  return (
    <Container>
      {showLyrics && (
        <LyricBox>
          {visibleLyrics().map((l) => ( 
            <ActiveLine key={l.text}>{l.text}</ActiveLine>
          ))}
        </LyricBox>
      )}

      <Button onClick={() => setShowLyrics((p) => !p)}>
        {showLyrics ? "Hide Lyrics" : "Show Lyrics"}
      </Button>

      {/* Cámara + Preview + Controles */}
      <VideoRecorder
        attemptsLeft={attemptsLeft}
        maxRecordingTime={MAX_RECORDING_TIME}
        onStop={handleStopRecording}
        onStartRecording={handleStartRecording}
        showCountdown={showCountdown}
        countdown={countdown}
      />

      {attemptsLeft === 0 && (
        <RenewAttempts
          message="Purchase more attempts"
          price={0.49}
          onClickBuy={() => 
            window.Pi.createPayment({
              amount: 0.49,
              memo: "Attempts",
              metadata: { productId: 'attempts_to_record' },
            })
          }
        />
      )}

      {/* Modal de login */}
      {showModal && <SignIn onSignIn={signIn} onModalClose={() => setShowModal(false)} />}

      <Nav>
        <Button onClick={() => navigate('/')}>BACK</Button>
        <Button onClick={() => navigate('/postpage')}>NEXT</Button>
      </Nav>
    </Container>
  );
}
