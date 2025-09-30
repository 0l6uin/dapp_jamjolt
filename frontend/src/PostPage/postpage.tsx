import React from 'react';
import { useNavigate } from 'react-router-dom';

const PostPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div>
      <nav>
        <button onClick={() => navigate('/')}>
          Home
        </button>
      </nav>
      <h1>Post Page</h1>
      <p>This is the Post Page content.</p>  
      <nav>
        <button onClick={() => navigate('/recpage')}>
          Back
        </button>
      </nav>
    </div>
  );
};

export default PostPage;