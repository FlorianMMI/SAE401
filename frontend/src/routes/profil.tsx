import React, { useEffect, useState, useCallback } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { fetchPostId, fetchuser } from '../lib/loaders';
import ProfileHeader from '../Component/Profil_Header';
import ProfilData from '../Component/Profil_Data';
import Card_text from '../Component/Card_text';
import Avatar from '../assets/Avatar.svg';
import Modification from '../ui/modification';

export async function fetchCurrentUser() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    
    const response = await fetch('http://localhost:8080/api/getidmessage', {
      headers: headers
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
}

export async function loader() {
  try {
    const userData = await fetchCurrentUser();
    const userId = userData.user.id;
    
    if (!userId) {
      throw new Error('User ID not found');
    }
    
    const userDetails = await fetchuser(userId);
    const userPosts = await fetchPostId(userId);
    
    return { datas: userDetails, posts: userPosts };
  } catch (error) {
    console.error('Error loading profile data:', error);
    throw error;
  }
}

interface User {
  id: number;
  username: string;
  avatar?: string;
  banniere?: string;
  localisation?: string;
  siteweb?: string;
  bio?: string;
}

interface Post {
  id: number;
  likes: number;
  media?: string;
  user: {
    id: number;
    image?: string;
    username: string;
  };
  message: string;
  posts?: {
    posts: Post[];
  };
}

export default function Profil() {
  const navigate = useNavigate();
  const loaderData = useLoaderData() as { datas: User, posts: { posts: { posts : Post[]} } };
  const user = loaderData.datas;
  const data = loaderData.posts.posts.posts || [];

  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || '');
  const [siteweb, setSiteweb] = useState(user.siteweb || '');
  const [localisation, setLocalisation] = useState(user.localisation || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBannerFile(e.target.files[0]);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No authentication token found");
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Create a FormData object to handle file uploads
      const formData = new FormData();
      
      // Add text fields to FormData
      formData.append('username', username);
      
      formData.append('bio', bio);
      formData.append('siteweb', siteweb);
      formData.append('localisation', localisation);
      
      // Add files to FormData if they exist
      if (avatarFile) {
        formData.append('avatar', avatarFile, avatarFile.name);
      } else {
        // Send null to indicate no file was uploaded
        formData.append('avatar', 'no_change');
      }
      
      if (bannerFile) {
        formData.append('banniere', bannerFile, bannerFile.name);
      } else {
        // Send null to indicate no file was uploaded
        formData.append('banniere', 'no_change');
      }

      console.log(formData.get('username'));
      
      // Send PATCH request to update user profile
      const response = await fetch(`http://localhost:8080/userpatch`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type header when using FormData
          // It will be automatically set with the correct boundary parameter
        },
        body: formData
      });
      
      if (!response.ok) {
        console.error(response);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log('Profile updated successfully:', responseData);
      
      // Close the form and refresh the page to show updated data
      setShowForm(false);
      // Reload the current route to reflect changes
      navigate(0);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <ProfileHeader 
          avatar={user.avatar ? `http://localhost:8080/avatar/${user.avatar}` : Avatar}
          images = {user.banniere ? `http://localhost:8080/banniere/${user.banniere}` : Avatar}
        />
        <ProfilData 
          username={user.username}
          bio={user.bio || 'Aucune description'}
          siteweb={user.siteweb || 'Aucun site web'}
          localisation={user.localisation || 'Aucune localisation'}
        />

        <button onClick={() => setShowForm(true)} className="">
          <Modification />
        </button>
        
        {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-90 backdrop-blur-sm">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <form onSubmit={handleProfileUpdate}>
              <div className="mb-4">
                <label className="block mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border px-2 py-1"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full border px-2 py-1"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block mb-1">Site Web</label>
                <input
                  type="url"
                  value={siteweb}
                  onChange={(e) => setSiteweb(e.target.value)}
                  className="w-full border px-2 py-1"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Localisation</label>
                <input
                  type="text"
                  value={localisation}
                  onChange={(e) => setLocalisation(e.target.value)}
                  className="w-full border px-2 py-1"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Avatar</label>
                <input type="file" accept="image/*" onChange={handleAvatarChange} />
                {user.avatar && (
                  <p className="text-xs mt-1">Avatar actuel: {user.avatar}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block mb-1">Bannière</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                />
                {user.banniere && (
                  <p className="text-xs mt-1">Bannière actuelle: {user.banniere}</p>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="mr-2 text-gray-700"
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="text-white bg-warmrasberry px-4 py-1 rounded"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Sauvegarder'}
                </button>
              </div>
            </form>
          </div>
        </div>
        )}
        
        <div className="w-3/4 h-px bg-[var(--color-warmrasberry)] my-5 mx-auto" />

        {data.map((post) => (
          <Card_text
            key={post.id}
            likes={post.likes}
            id={post.id}
            media = {post.media ? `http://localhost:8080/uploads/${post.media}` : undefined}
            user_id={post.user.id}
            userImage={post.user.image ? `http://localhost:8080/avatar/${post.user.image}` : Avatar}
            username={post.user.username}
            message={post.message}
          />
        ))}
      </div>
    </>
  );
}
