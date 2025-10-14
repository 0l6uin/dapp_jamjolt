// src/HomePage/styles/HomePage.styled.ts
import styled from 'styled-components';
import backgroundImage from '../components/background.png';


export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  background-image: url(${backgroundImage});
  background-size: 390px 880px; /* Ensures image covers the container */
  background-position: center; /* Centers the image */
  background-repeat: no-repeat; /* Prevents tiling */
  background-color: black;
  box-sizing: border-box; /* Ensures padding doesn't increase size */
  text_align: center;
  position: absolute;

  /* Responsive adjustments */
  @media (min-width: 768px) {
    padding: 0px;
  }
`;

export const Logo = styled.img`
  width: 60vw;
  max-width: 200px;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    width: 20vw;
    max-width: 250px;
  }
`;

export const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  background: none;
  gap: 1.5rem;
  align-items: center;
  width: 100%;
  max-width: 300px;
`;

export const Button = styled.button`
  background-color: #FFD700;
  background-border: none;
  margin: 20px 20px;
  border-radius: 25px;
  border: none;
  color: none;
  padding: 12px 24px;
  font-size: 20px;
  font-weight: 750;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  width: 150px;
  heigth: 70px;
  text-align: center;

  &:hover {
    background-color: #5c2bceff;
    transform: translateY(-2px);
  }

  @media (min-width: 768px) {
    font-size: 1.1rem;
    padding: 14px 32px;
    max-width: 250px;
  }
`;

export const Link = styled.a`
  color: #0aacecff;
  border: none;
  padding: 0;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  width: 100%;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #218838;
    transform: translateY(-2px);
  }

  @media (min-width: 768px) {
    font-size: 1.1rem;
    padding: 14px 32px;
    max-width: 250px;
  }
`;