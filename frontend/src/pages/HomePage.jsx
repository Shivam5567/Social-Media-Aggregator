// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import api from '../api';
import Post from '../components/Post';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  
  // State for the new post form
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  
  const navigate = useNavigate(); // Get the navigate function

  const fetchPosts = async () => {
    try {
      const response = await api.get('/api/posts/');
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setError('Failed to fetch posts. You may need to log in.');
    }
  };
  
  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', image);
    formData.append('caption', caption);

    try {
      await api.post('/api/posts/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setImage(null);
      setCaption('');
      fetchPosts();
    } catch (error) {
      console.error('Failed to create post:', error);
      setError('Failed to create post.');
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    api.defaults.headers.common['Authorization'] = null;
    navigate('/login'); // Redirect to login page
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px' }}>
        <h1>Home Feed</h1>
        <button onClick={handleLogout}>Logout</button> {/* Add logout button */}
      </div>

      <div style={{ border: '1px solid #ddd', padding: '16px', margin: '16px auto', maxWidth: '600px', backgroundColor: '#fff' }}>
        <h2>Create a New Post</h2>
        <form onSubmit={handlePostSubmit}>
          <div>
            <label htmlFor="image">Image:</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              required
            />
          </div>
          <div>
            <label htmlFor="caption">Caption:</label>
            <input
              type="text"
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
          <button type="submit">Post</button>
        </form>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div>
        {posts.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;