// components/TrainPage.js
import { useNavigate } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import musicFile from './assets/music.mp3';
import songFile from './assets/song.mp3';
import { PlayArrow, MusicNote, Pause, Stop } from "@mui/icons-material";
import { Container, Button, ButtonMusic, LyricBox, ActiveLine, DefaultLine, Nav, VideoScreen} from './styles/TrainPage.style';
import SignIn from './components/SignIn';
import YouTubeVideoPlayer from './components/videoLinks'

// Interface for Lyrics Structure
interface Lyric {
  time: number;
  text: string;
}

// letra con timestamps
 const lyrics: Lyric[] = [
  { time: 0, text: "..." },
  { time: 30, text: "It took me by surprise, I must say" },
  { time: 34, text: "When I found out yesterday" },
  { time: 38, text: "Ooh-ooh I heard it through the grapevine" },
  { time: 42, text: "Not much longer would you be mine" },
  { time: 46, text: "Ooh-ooh I heard it through the grapevine" },
  { time: 50, text: "And I'm just about to lose my mind" },
  { time: 54, text: "Honey, honey, yeah" },
];

const TrainPage: React.FC = () => {
  
  const navigate = useNavigate();
  const musicRef = useRef<HTMLAudioElement>(new Audio(musicFile));
  const songRef = useRef<HTMLAudioElement>(new Audio(songFile));

  const [activeLine, setActiveLine] = useState<number>(-1); // start with -1 to show first three lines
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [isPlayingSong, setIsPlayingSong] = useState<boolean>(false);

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

  // Setup audio listeners and cleanup
  useEffect(() => {
    const musicAudio = musicRef.current;
    const songAudio = songRef.current;

    const cleanupMusic = syncLyrics(musicAudio);
    const cleanupSong = syncLyrics(songAudio);

    return () => {
      cleanupMusic();
      cleanupSong();
      musicAudio.pause();
      songAudio.pause();
    };
  }, []);

  // Toggle play/pause for music
  const handlePlayMusic = () => {
    const audio = musicRef.current;

    if (isPlayingMusic) {
      audio.pause();
      setIsPlayingMusic(false);
    } else {
      if (isPlayingSong) {
        songRef.current.pause();
        songRef.current.currentTime = 0;
        setIsPlayingSong(false);
      }
      audio.currentTime = 30; // Starts at 30s
      audio.play().catch((error) => console.error('Music playback error:', error));
      setIsPlayingMusic(true);
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

  // Toggle play/pause for song
  const handlePlaySong = () => {
    const audio = songRef.current;

    if (isPlayingSong) {
      audio.pause();
      setIsPlayingSong(false);
    } else {
      // Stop the other audio if playing
      if (isPlayingMusic) {
        musicRef.current.pause();
        musicRef.current.currentTime = 0;
        setIsPlayingMusic(false);
      }
      audio.play().catch((error) => console.error('Song playback error:', error));
      setIsPlayingSong(true);
    }
  };

  // Stop both audios and reset
  const handleStop = () => {
    musicRef.current.pause();
    songRef.current.pause();
    musicRef.current.currentTime = 0;
    songRef.current.currentTime = 0;
    setIsPlayingMusic(false);
    setIsPlayingSong(false);
    setActiveLine(-1);
  };

  // Get the three lines to display
  const getVisibleLyrics = () => {
    if (activeLine === -1) {
      // Show first three lines before music starts
      return lyrics.slice(0, 3);
    }
    const prevLine = activeLine > 0 ? lyrics[activeLine -1] : null;
    const currentLine = lyrics[activeLine] || null;
    const nextLine = activeLine < lyrics.length -1 ? lyrics[activeLine + 1] : null;
    return [prevLine, currentLine, nextLine].filter((line) => line !== null) as Lyric[];
  };

  return (
    <Container>
      <VideoScreen>
        <iframe
          src="https://www.youtube.com/embed/watch?v=wCCfc2vAuDU"
          title="I Heard It Through The Grapevine"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </VideoScreen>
      <Nav>
        <ButtonMusic onClick={handlePlayMusic}>
          <p> Train </p>
          {isPlayingMusic ? <Pause fontSize="large" /> : <MusicNote fontSize="large" />}
        </ButtonMusic>
        <ButtonMusic onClick={handlePlaySong}>
          <p>Listen</p>
          {isPlayingSong ? <Pause fontSize="large" /> : <PlayArrow fontSize="large" />}
        </ButtonMusic>
        <ButtonMusic onClick={handleStop}>
          <p>Stop</p>
          <Stop fontSize="large" />
        </ButtonMusic>
      </Nav>

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

      {<Nav>
        <Button onClick={() => navigate('/')}>BACK</Button>
      </Nav>}
    </Container>
  );
};

export default TrainPage;