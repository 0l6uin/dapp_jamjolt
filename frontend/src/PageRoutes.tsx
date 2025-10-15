import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage/homepage';
import TrainPage from './TrainPage/trainpage';
import RecPage from './RecPage/recpage';
import PostPage from './PostPage/postpage';
import RankPage from './RankPage/rankpage';
import ValidationKey from './validation-key.txt';
//import Navbar from './Navbar';

const PageRoutes: React.FC = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path ="/" element={<HomePage />} />
          <Route path ="/trainpage" element={<TrainPage />} />
          <Route path ="/recpage" element={<RecPage />} />
          <Route path ="/postpage" element={<PostPage />} />
          <Route path ="/ranking" element={<RankPage />} />
          <Route path ="/validation-key.txt" element={<ValidationKey />} />
          <Route path ="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
};

export default PageRoutes;
