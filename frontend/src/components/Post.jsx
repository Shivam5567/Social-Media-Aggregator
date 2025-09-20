// src/components/Post.jsx
import React from 'react';

// A simple component to display post details
function Post({ post }) {
  const postStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    margin: '16px auto',
    maxWidth: '600px',
    backgroundColor: '#fff',
  };

  const imageStyle = {
    width: '100%',
    height: 'auto',
    borderRadius: '4px',
  };

  return (
    <div style={postStyle}>
      <h3>{post.author_username}</h3>
      <img src={post.image} alt={`Post by ${post.author_username}`} style={imageStyle} />
      <p>{post.caption}</p>
    </div>
  );
}

export default Post;