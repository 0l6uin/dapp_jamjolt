import style from 'styled-components';
import backgroundImage from '../assets/background.png';

export const Container = style.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-width: 100vw;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  background-image: url(${backgroundImage});
  background-size: auto; /* Ensures image covers the container */
  background-position: center; /* Centers the image */
  background-repeat: no-repeat; /* Prevents tiling */
  background-color: black;
  box-sizing: border-box; /* Ensures padding doesn't increase size */
  text-align: center;
  position: absolute;

  /* Responsive adjustments */
  @media {
    background-size: 390px 880px;
  }
`;

export const ButtonMusic = style.button`
  flex-direction: row;
  color: #FFD700;
  border: 2px solid;
  background: black;
  border-radius: 100%;
  margin: 25px 25px;
  padding: 10px 10px;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  item-align: center;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }

  @media (min-width: 768px) {
    padding: 10px 10px;
  }
`;

export const VideoScreen = style.div`
 border-radius: 20px;
 overflow: hidden; /* Ensures content respects the border-radius */
 position: relative;
 height: 200px; /* Allows padding-bottom to control height */
 width: 80%; /* Responsive width */
 max-width: 350px;
 margin: 25px 25px; /* Centers the video */
 box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Adds a subtle shadow */
 background-color: #f9f9f9; /* Light background for contrast */

 iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none; /* Removes iframe border */
    border-radius: 15px; /* Matches the parent container */
  }
`;
export const LyricBox = style.div`
  background: white;  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 80%;
  max-width: 350px;
  min-height: auto;
  margin: 25px 25px;
  border-radius: 15px;
  border:  1px solid rgba(244, 26, 6, 0.78);
  text-align: left;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  background-size: cover; /* Ensures image covers the container */
  background-position: center; /* Centers the image */
  background-repeat: no-repeat; /* Prevents tiling */
  padding: 15px;
  box-sizing: border-box; /* Ensures padding doesn't increase size */

  /* Responsive adjustments */
  @media (min-width: 768px) {
    padding: 20px;
  }
`;

/* Highlighted lyric line */
export const ActiveLine = style.div`
  background: yellow;
  color: black;
  font-weight: bold;
  border-radius: 4px;
  padding: 2px 4px;
`;

export const Nav = style.nav`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  background: none;
`;

export const Button = style.button`
  background-color: #FFD700;
  color: black;
  border: 2px solid black;
  border-radius: 15px;
  padding: 12px 24px;
  margin: 20px 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  width: 100px;
  height: 50px;
  text-align: center;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }

  @media (min-width: 768px) {
    font-size: 1rem;
    padding: 14px 24px;
    max-width: 250px;
  }
`;

export const DefaultLine = style.p`
  padding: 10px;
  color: #333;
  font-weight: 400;
  font-size: 1rem;
  text-align: center;
  width: 100%;
  margin: 0;
  opacity: 0.7;

  @media (min-width: 768px) {
    font-size: 1.2rem;
    padding: 12px;
  }
`;