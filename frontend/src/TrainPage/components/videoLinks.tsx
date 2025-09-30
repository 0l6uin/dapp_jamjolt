import React, { useState } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';

const YouTubeVideoPlayer: React.FC = () => {
  // State to control video playback
  const [playVideo, setPlayVideo] = useState(false);

  // YouTube video ID (replace with your video ID)
  const videoId = 'wCCfc2vAuDU'; // e.g., 'dQw4w9WgXcQ'

  // YouTube player options
  const opts: YouTubeProps['opts'] = {
    height: '200', // Adjust size for small screen
    width: '300',
    playerVars: {
      autoplay: 0, // Don't autoplay initially
      controls: 1, // Show controls
      modestbranding: 1, // Minimize YouTube branding
    },
  };

  // Handle click to play video
  const handleVideoClick = () => {
    setPlayVideo(true);
  };

  // Handle YouTube player ready event
  const onReady = (event: { target: any }) => {
    if (playVideo) {
      event.target.playVideo(); // Play video if playVideo is true
    }
  };

  return (
    <div style={{ cursor: 'pointer' }} onClick={handleVideoClick}>
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        className="youtube-video"
      />
    </div>
  );
};

export default YouTubeVideoPlayer;