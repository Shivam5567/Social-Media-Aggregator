// src/components/Post.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function Post({ post, onUpdate }) {
  const [newComment, setNewComment] = useState('');

  const handleLike = async () => {
    try {
      await api.post(`/api/posts/${post.id}/like/`);
      onUpdate(); // This calls the fetch function from the parent (HomePage or ProfilePage)
    } catch (error) {
      console.error('Failed to like the post:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await api.post(`/api/posts/${post.id}/comments/`, { text: newComment });
      setNewComment(''); // Clear the input field
      onUpdate(); // Refresh the posts
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  // --- Basic Styling ---
  const postStyle = { border: '1px solid #ddd', borderRadius: '8px', margin: '16px auto', maxWidth: '600px', backgroundColor: '#fff' };
  const imageStyle = { width: '100%', height: 'auto' };
  const linkStyle = { textDecoration: 'none', color: 'inherit', fontWeight: 'bold' };
  const contentStyle = { padding: '0 16px 16px' };
  const commentStyle = { fontSize: '0.9em', marginTop: '4px' };
  const formStyle = { display: 'flex', marginTop: '8px' };
  const inputStyle = { flexGrow: 1, border: 'none', borderTop: '1px solid #ddd', padding: '8px' };

  return (
    <div style={postStyle}>
      <div style={{ padding: '12px 16px' }}>
        <Link to={`/profile/${post.author_username}`} style={linkStyle}>
          {post.author_username}
        </Link>
      </div>
      <img src={post.image} alt={`Post by ${post.author_username}`} style={imageStyle} />
      <div style={contentStyle}>
        <div style={{ padding: '8px 0' }}>
          <button onClick={handleLike} style={{ marginRight: '8px' }}>Like</button>
          <span>{post.likes_count} Likes</span>
        </div>
        <p>
          <span style={{ fontWeight: 'bold' }}>{post.author_username}</span> {post.caption}
        </p>
        <div>
          {post.comments.map(comment => (
            <div key={comment.id} style={commentStyle}>
              <span style={{ fontWeight: 'bold' }}>{comment.author_username}</span> {comment.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleCommentSubmit} style={formStyle}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            style={inputStyle}
          />
          <button type="submit" style={{ border: 'none', background: 'none', color: '#0095f6', fontWeight: 'bold' }}>Post</button>
        </form>
      </div>
    </div>
  );
}

export default Post;