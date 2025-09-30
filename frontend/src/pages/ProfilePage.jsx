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
    setLoading(true);
    fetchProfile();
  }, [username]);
  
  const handleFollowToggle = async () => {
    try {
      await api.post(`/api/users/profiles/${username}/follow/`);
      fetchProfile();
    } catch (err) {
      console.error('Failed to follow/unfollow:', err);
    }
  };

  const handlePictureUpload = async (e) => {
    e.preventDefault();
    if (!newProfilePicture) return;
    const formData = new FormData();
    formData.append('profile_picture', newProfilePicture);
    try {
      await api.patch(`/api/users/profiles/${username}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchProfile();
      setNewProfilePicture(null);
      document.getElementById('profilePicture-input').value = null;
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
      <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '40px' }}>
        <img
          src={profile.profile_picture || 'https://via.placeholder.com/150'}
          alt={`${profile.username}'s profile`}
          style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
        />
        <div>
          <h2>{profile.username}</h2>
          
          {!isOwner && (
            <button onClick={handleFollowToggle}>
              {profile.is_following ? 'Unfollow' : 'Follow'}
            </button>
          )}

          <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
            <span><strong>{profile.posts.length}</strong> posts</span>
            <span><strong>{profile.followers_count}</strong> followers</span>
            <span><strong>{profile.following_count}</strong> following</span>
          </div>
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