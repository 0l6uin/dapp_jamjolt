import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import RenewAttempts from './components/RenewAttempts';
import SignIn from './components/SignIn';
import Header from './components/Header';
import { Container, Button, Nav } from './styles/RecPage';
import musicFile from '../TrainPage/assets/music.mp3';
import { LyricBox, ActiveLine, DefaultLine} from '../TrainPage/styles/TrainPage.style';
import VideoRecorder from "./components/VideoRecorder"

type MyPaymentMetadata = {};

type AuthResult = {
  accessToken: string,
  user: {
    uid: string,
    username: string
  }
};

export type User = AuthResult['user'];

interface PaymentDTO {
  amount: number,
  user_uid: string,
  created_at: string,
  identifier: string,
  metadata: Object,
  memo: string,
  status: {
    developer_approved: boolean,
    transaction_verified: boolean,
    developer_completed: boolean,
    cancelled: boolean,
    user_cancelled: boolean,
  },
  to_address: string,
  transaction: null | {
    txid: string,
    verified: boolean,
    _link: string,
  },
};

// Make TS accept the existence of our window.__ENV object - defined in index.html:
interface WindowWithEnv extends Window {
  __ENV?: {
    backendURL: string, // REACT_APP_BACKEND_URL environment variable
    sandbox: "true" | "false", // REACT_APP_SANDBOX_SDK environment variable - string, not boolean!
  }
}

const _window: WindowWithEnv = window;
const backendURL = _window.__ENV && _window.__ENV.backendURL;

const axiosClient = axios.create({ baseURL: `${backendURL}`, timeout: 20000, withCredentials: true});
const config = {headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}};

/// START OF VIDEO CONST

const MAX_ATTEMPTS = 2;
const MAX_RECORDING_TIME = 10_000; // 30 seconds

/// END OF VIDEO CONST

/// START OF MUSIC AND LYRIC

// Interface for Lyrics Structure
interface Lyric {
  time: number;
  text: string;
}

// letra con timestamps
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

/// END OF MUSIC AND LYRIC

export default function KARAOKE() {
  const navigate = useNavigate();  // added to continue jamjolt app

  const [showLyrics, setShowLyrics] = useState(true); // State for Lyiric visibility

  //VIDEO SECTION
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);

  const [user, setUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Initialize the camera
  useEffect(() => {
    async function setupCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
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

  // Countdown of 3 seconds before recording
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

  // Start recording
  const startRecording = () => {
    if (!stream || attemptsLeft <= 0) return;

    const recorder = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      setRecordedBlob(blob); //

      // Stop/reset music + lyrics when recording stops
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setActiveLine(-1);
      }
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
    setRecording(true);

    // Start music and lyric sync together when recording starts
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }

    setTimeout(() => stopRecording(), MAX_RECORDING_TIME);
  };

  // STOP RECORDING
  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    setRecording(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setActiveLine(-1);
    }

    setAttemptsLeft((prev) => prev - 1);
  };

  // START AUDIO AND LYRIC

  const musicRef = useRef<HTMLAudioElement>(new Audio(musicFile));

  const [activeLine, setActiveLine] = useState<number>(-1); // start with -1 to show first three lines
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);

  // Sync lyrics with audio time
  const syncLyrics = (audio: HTMLAudioElement) => {
    const updateTime = () => {
      const currentTime = audio.currentTime;
      let currentLine = -1; // Default to -1 (no line active before first lyric)
      for (let i = 0; i < lyrics.length; i++) {
        if (
          currentTime >= lyrics[i].time &&
          (i === lyrics.length - 1 || currentTime < lyrics[i + 1].time)
        ) {
          currentLine = i;
          break;
        }
      }
      setActiveLine(currentLine);
    };
    audio.addEventListener('timeupdate', updateTime);
    return () => audio.removeEventListener('timeupdate', updateTime); // Cleanup
  };

  // Get the three lines to display
  const getVisibleLyrics = () => {
    if (activeLine === -1) {
      // Show first three lines before music starts
      return lyrics.slice(0,3);
    }
    const prevLine = activeLine > 0 ? lyrics[activeLine -1] : null;
    const currentLine = lyrics[activeLine] || null;
    const nextLine = activeLine < lyrics.length -1 ? lyrics[activeLine + 1] : null;
    return [prevLine, currentLine, nextLine].filter((line) => line !== null) as Lyric[];
  };

  // Setup audio listeners and cleanup
  useEffect(() => {
    const musicAudio = musicRef.current;

    const cleanupMusic = syncLyrics(musicAudio);

    return () => {
      cleanupMusic();
      musicAudio.pause();
    };
  }, []);

  // Toggle play/pause for music
  const handlePlayMusic = () => {
    const audio = musicRef.current;

    if (isPlayingMusic) {
      audio.pause();
      setIsPlayingMusic(false);
    }

    // Stop at 56s
    const stopAt = () => {
      if (audio.currentTime >= 56) {
        audio.pause();
        audio.currentTime = 30; // Optional: reset to start of segment
        setIsPlayingMusic(false);
        setActiveLine(-1);
      }
    };

    // Remove old listeners before adding new one
    audio.removeEventListener("timeupdate", stopAt);
    audio.addEventListener("timeupdate", stopAt);
  };

  // END AUDIO AND LYRIC

  const renewAttempts = () => {
    setAttemptsLeft(MAX_ATTEMPTS);
  };

  const goToReview = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      navigate("/review", { state: { videoUrl: url } });
    }
  };  

  /// END OF RECORDING SECTION

  const signIn = async () => {
    const scopes = ['username', 'payments'];
    const authResult: AuthResult = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
    signInUser(authResult);
    setUser(authResult.user);
  }

  const signOut = () => {
    setUser(null);
    signOutUser();
  }

  const signInUser = (authResult: AuthResult) => {
    axiosClient.post('/user/signin', {authResult});
    return setShowModal(false);
  }

  const signOutUser = () => {
    return axiosClient.get('/user/signout');
  }

  const onModalClose = () => {
    setShowModal(false);
  }

  const orderProduct = async (memo: string, amount: number, paymentMetadata: MyPaymentMetadata) => {
    if(user === null) {
      return setShowModal(true);
    }
    const paymentData = { amount, memo, metadata: paymentMetadata };
    const callbacks = {
      onReadyForServerApproval,
      onReadyForServerCompletion,
      onCancel,
      onError
    };
    const payment = await window.Pi.createPayment(paymentData, callbacks);
    console.log(payment);
  }

  const onIncompletePaymentFound = (payment: PaymentDTO) => {
    console.log("onIncompletePaymentFound", payment);
    return axiosClient.post('/payments/incomplete', {payment});
  }

  const onReadyForServerApproval = (paymentId: string) => {
    console.log("onReadyForServerApproval", paymentId);
    axiosClient.post('/payments/approve', {paymentId}, config);
  }

  const onReadyForServerCompletion = (paymentId: string, txid: string) => {
    console.log("onReadyForServerCompletion", paymentId, txid);
    axiosClient.post('/payments/complete', {paymentId, txid}, config)
      .then(() => {
        renewAttempts();
      });
  };

  const onCancel = (paymentId: string) => {
    console.log("onCancel", paymentId);
    return axiosClient.post('/payments/cancelled_payment', {paymentId});
  }

  const onError = (error: Error, payment?: PaymentDTO) => {
    console.log("onError", error);
    if (payment) {
      console.log(payment);
      // handle the error accordingly
    }
  }

  return (
    <Container>
      <Nav>
        <Header user={user} onSignIn={signIn} onSignOut={signOut}/>
      </Nav>

      
      <div style={{ flexDirection: "column", alignItems: "center", display: "flex", gap: "20px", marginTop: "20px"}}>
        {/* Lyrics Section */}
        {showLyrics && (
          <LyricBox>
            {getVisibleLyrics().map((lyric, index, array) => {
              const isActive = array[1]?.text === lyric.text && activeLine >= 0; // Middle line is active
              return isActive ? (
                <ActiveLine key={lyric.text}>{lyric.text}</ActiveLine>
              ) : (
                <DefaultLine key={lyric.text}>{lyric.text}</DefaultLine>
              );
            })}
          </LyricBox>
        )}

        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px"}}>
          {/* Video Section */}
          <div style={{ flex: showLyrics ? 1 : 2 }}>
            {/* Show camera ONLY if there is not a video yet*/}
            {!recordedBlob && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{ width: "100%", border: "2px solid black" }}
              />
            )}

            {/* If there is a video recorded, it shows the preview*/}
            {recordedBlob && (
              <div style={{ marginTop: "20px" }}>
                <h3>Preview:</h3>
                <video
                  src={URL.createObjectURL(recordedBlob)}
                  controls
                  style={{ width: "100%" }}
                />
                <br/>
                <button onClick={goToReview}>Next ➡</button>
              </div>
            )}
          </div>

          {countdown && <h1>{countdown}</h1>}
    
          {/* Control Panel */} 
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px"}}>
            <Button onClick={() => setShowLyrics((prev) => !prev)}>
              {showLyrics ? "Hide Lyrics" : "Show Lyrics"}
            </Button>
            <p>Attempts left: {attemptsLeft}</p>
            <button
              disabled={recording || attemptsLeft <= 0}
              onClick={() => {
                setRecordedBlob(null); // clean the recording preview to turn the camera
                startCountdown();
              }}
            >
              🎤 Record
            </button>
            <button disabled={!recording} onClick={stopRecording}>
              ⏹ Stop
            </button>
          </div>
        </div>
      </div>

      <audio ref={audioRef} src={musicFile} />

      {attemptsLeft === 0 && (
        <RenewAttempts
          message="Purchase a Competition Pass"
          price={0.49}
          onClickBuy={() => orderProduct("Order a Pass", 0.49, { productId: 'Pass_to_compete' })}
        />
      )}

      { showModal && <SignIn onSignIn={signIn} onModalClose={onModalClose} /> }

      <Nav>
        <Button onClick={() => navigate('/')}>
          BACK
        </Button>
        <Button onClick={() => navigate('/postpage')}>
          NEXT
        </Button>
      </Nav>
    </Container>
  );
}
