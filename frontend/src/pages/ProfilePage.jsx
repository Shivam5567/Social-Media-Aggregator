// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api';
import Post from '../components/Post';

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newProfilePicture, setNewProfilePicture] = useState(null);

  const { username } = useParams();

  const token = localStorage.getItem('access_token');
  const loggedInUserId = token ? jwtDecode(token).user_id : null;

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/users/profiles/${username}/`);
      setProfile(response.data);
    } catch (err) {
      setError('Profile not found.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const handlePictureUpload = async (e) => {
    e.preventDefault();
    if (!newProfilePicture) return;

    const formData = new FormData();
    formData.append('profile_picture', newProfilePicture);

    try {
      await api.patch(`/api/users/profiles/${username}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      document.getElementById('profilePicture-input').value = null; // Clear file input
      fetchProfile();
      setNewProfilePicture(null);
    } catch (err) {
      console.error('Failed to upload profile picture:', err);
      setError('Failed to upload picture.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!profile) return null;

  const isOwner = loggedInUserId == profile.user_id;

  return (
    <div>
      <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <img
          src={profile.profile_picture || 'https://via.placeholder.com/150'}
          alt={`${profile.username}'s profile`}
          style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
        />
        <div>
          <h2>{profile.username}</h2>
          <p>{profile.bio || 'No bio yet.'}</p>
        </div>
      </div>

      {isOwner && (
        <div style={{ padding: '16px' }}>
          <form onSubmit={handlePictureUpload}>
            <label htmlFor="profilePicture-input">Change Profile Picture:</label>
            <input
              type="file"
              id="profilePicture-input"
              accept="image/*"
              onChange={(e) => setNewProfilePicture(e.target.files[0])}
            />
            <button type="submit">Upload</button>
          </form>
        </div>
      )}

      <hr />
      <h3>Posts</h3>
      <div>
        {profile.posts && profile.posts.length > 0 ? (
          profile.posts.map(post => <Post key={post.id} post={post} onUpdate={fetchProfile} />)
        ) : (
          <p>This user has no posts yet.</p>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;