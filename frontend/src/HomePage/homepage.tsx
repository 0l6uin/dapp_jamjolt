import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink} from 'react-router-dom';
import { Container, Logo, Nav, Button, Link} from './styles/HomePage.style'
import logo from './components/logo.png';
import axios from 'axios';
import SignIn from 'RecPage/components/SignIn';
import Header from 'RecPage/components/Header';

// START AUTHENTICATION CONST

type AuthResult = {
  accessToken: string,
  user: {
    uid: string,
    username: string
  }
};

export type User = AuthResult['user'];

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

// END AUTHENTICATION CONST

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // START PI AUTHENTICATION

  const [user, setUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const signIn = async () => {
    const scopes = ['username'];
    const authResult: AuthResult = await window.Pi.authenticate(scopes);
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

  // END PI AUTHENTICATION

  return (
    <Container>
      <Header user={user} onSignIn={signIn} onSignOut={signOut}/>
      <Logo src={logo} alt="App Logo"/>
      <Nav>
        <Button onClick={() => navigate('/trainpage')}>
          Train
        </Button>
        <Button onClick={() => navigate('/recpage')}>
          Compete
        </Button>
        <Link as={RouterLink} to='/ranking'>
          View 50-Top List
        </Link>
      </Nav>
    </Container>
  );
};

export default HomePage;