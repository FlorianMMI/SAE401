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
interface Blocked {
  id: number;
  user_id: number;
  blocked_user_id: number;
}

export async function loader({ params }: { params: Params<string> }) {
  const userId = params.id;
  console.log(userId);
  const user = await fetchuser(userId);
  const blocked = await fetchBlocked();
  const posts = await fetchPostId(userId);
  console.log(user);
  return { datas: user, posts, blocked };
}



export default function OtherProfil() {
  const navigate = useNavigate();
  const loaderData = useLoaderData() as { datas: User, posts: { posts: { posts : Post[]} }, blocked: Blocked[] };
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const user = loaderData.datas;
  const data = loaderData.posts.posts.posts || [];
  const blocked = loaderData.blocked || [];

  useEffect(() => {
    if (blocked.some((b) => b.id == user.id)) {
      setIsBlocked(true);
    }
  }, [blocked, user.id]);
  
  
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
        

      <div className="my-5">
        <button
          onClick={async () => {
            console.log("ceci est ", user.id);
            const endpoint = isBlocked
              ? `http://localhost:8080/unblock/` + user.id
              : `http://localhost:8080/block/` + user.id;
            const token = localStorage.getItem('token');
            const response = await fetch(endpoint, {
              method: 'POST',
              headers: {
              'Authorization': `Bearer ${token}`
              }
            });
            if (response.ok) {
              setIsBlocked(!isBlocked);
            }
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isBlocked ? "Débloquer" : "Bloquer"}
        </button>
      </div>
        
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
