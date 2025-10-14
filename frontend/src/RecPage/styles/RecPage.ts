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
  border: none;
  background: none;
  margin: 20px 25px;
  padding: 0px;;
  font-size: 24px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  text-align: center;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }

  @media (min-width: 768px) {
    font-size: 1.1rem;
    padding: 14px 32px;
    max-width: 250px;
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
    padding: 15px;
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
  border: 1px solid #FFD700;
  border-radius: 15px;
  padding: 0;
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
    font-size: 1.1rem;
    padding: 0;
    max-width: 250px;
  }
`;

export const HomeButton = style.button`
  background-color: #400ad4ff;
  border-radius: 15px;
  color: white;
  padding: 0;
  margin: 20px 20px;
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
    padding: 0;
    max-width: 250px;
  }
`;