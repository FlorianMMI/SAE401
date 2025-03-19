import React from 'react';
import Card_text from '../Component/Card_text';
import Card_Post from '../Component/Card_Post';
import { useLoaderData } from 'react-router-dom';
import Avatar from '../assets/Avatar.svg';




import { Outlet } from 'react-router-dom';
import { fetchPost } from '../lib/loaders';

export async function loader() {
  const posts = await fetchPost();
  console.log('ceci est post', posts);
  return posts.posts;
}

interface Post {
  created_at: string;
  id: number;
  user: {
    username: string;
    image?: string ;
  };
  message: string;
}

export default function Home() {
  const posts = useLoaderData() as Post[];
  return (
    <>
      <Card_Post />
      <div>
        {posts.map((post) => (
          <Card_text
            key={post.id}
            userImage={post.user.image || Avatar}
            username={post.user.username}
            message={post.message}
          />
        ))}
      </div>
    </>
  );
}
      
