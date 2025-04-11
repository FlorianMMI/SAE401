import React, { useEffect, useState, useCallback } from 'react';
import { useLoaderData, useNavigate, Params } from 'react-router-dom';
import { fetchBlocked, fetchPostId, fetchuser } from '../lib/loaders';
import ProfileHeader from '../Component/Profil_Header';
import ProfilData from '../Component/Profil_Data';
import Card_text from '../Component/Card_text';
import Avatar from '../assets/Avatar.svg';



interface User {
  id: number;
  username: string;
  avatar?: string;
  banniere?: string;
  localisation?: string;
  siteweb?: string;
  bio?: string;
  login:number;
}

interface Post {
  id: number;
  likes: number;
  media?: string;
  blockedby: boolean;
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
interface Blocked {
  id: number;
  user_id: number;
  blocked_user_id: number;
}

export async function loader({ params }: { params: Params<string> }) {
  const userId = params.id;
  
  const user = await fetchuser(userId);
  const blocked = await fetchBlocked();
  const posts = await fetchPostId(userId);
  
  return { datas: user, posts, blocked };
}

export default function OtherProfil() {
  const navigate = useNavigate();
  const loaderData = useLoaderData() as { datas: User, posts: { posts: { posts : Post[]} }, blocked: Blocked[] };
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const user = loaderData.datas;
  const data = loaderData.posts.posts.posts || [];
  const blocked = loaderData.blocked || [];
  const token = localStorage.getItem('token') || '';

  // Fetch current user ID
  useEffect(() => {
    if (token) {
      fetch(import.meta.env.VITE_URL + `/api/getidmessage`, { headers: { 'Authorization': `Bearer ${token}` }})
        .then(res => res.json())
        .then(data => {
          if(data.user && data.user.id) {
            setCurrentUserId(data.user.id);
          }
        })
        .catch(err => console.error(err));
    }
  }, [token]);

  // Check follow status
  useEffect(() => {
    if (token && currentUserId !== null) {
      fetch(import.meta.env.VITE_URL + `/user/${user.id}/is-following`, { headers: { 'Authorization': `Bearer ${token}` }})
        .then(res => res.json())
        .then(data => setIsFollowing(data.isFollowing))
        .catch(err => console.error(err));
    }
  }, [token, currentUserId, user.id]);

  const toggleFollow = () => {
    if (!token || currentUserId === null) return;
    const endpoint = isFollowing ? '/user/unsubscribes' : '/user/subscribes';
    fetch(import.meta.env.VITE_URL + `${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ id: currentUserId, sub: user.id })
    })
      .then(res => {
        if (!res.ok) throw new Error('Erreur');
        return res.json();
      })
      .then(() => setIsFollowing(!isFollowing))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (blocked.some((b) => b.id == user.id)) {
      setIsBlocked(true);
    }
  }, [blocked, user.id]);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <ProfileHeader 
          avatar={user.avatar ? import.meta.env.VITE_URL + `/avatar/${user.avatar}` : Avatar}
          images={user.banniere ? import.meta.env.VITE_URL + `/banniere/${user.banniere}` : Avatar}
        />
        <ProfilData 
          username={user.username}
          bio={user.bio || 'Aucune description'}
          siteweb={user.siteweb || 'Aucun site web'}
          localisation={user.localisation || 'Aucune localisation'}
        />
        {/* Follow toggle button added */}
        <div className="my-5 flex gap-4">
          <button
            onClick={() => {
          
              const endpoint = isBlocked
                ? import.meta.env.VITE_URL + `/unblock/${user.id}`
                : import.meta.env.VITE_URL + `/block/${user.id}`;
              fetch(endpoint, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
              })
                .then(response => {
                  if (response.ok) {
                    setIsBlocked(!isBlocked);
                  }
                });
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {isBlocked ? "Unblocked" : "Block"}
          </button>
          <button
            onClick={toggleFollow}
            className="bg-thistlepink hover:bg-thistlepink-hover text-white px-4 py-2 rounded"
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        </div>
        
        <div className="w-3/4 h-px bg-[var(--color-warmrasberry)] my-5 mx-auto" />
        {data.map((post) => (
          <Card_text
            key={post.id}
            likes={post.likes}
            id={post.id}
            media={post.media ? import.meta.env.VITE_URL + `/uploads/${post.media}` : undefined}
            user_id={post.user.id}
            userImage={post.user.image ? import.meta.env.VITE_URL + `/avatar/${post.user.image}` : Avatar}
            username={post.user.username}
            message={post.message}
            blockedby= {post.blockedby}
            login={user.login}
          />
        ))}
      </div>
    </>
  );
}
