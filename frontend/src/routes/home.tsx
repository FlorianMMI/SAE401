import React from 'react';
import Card_text from '../ui/Card_text';
import Card_Post from '../ui/Card_Post';
import { useLoaderData } from 'react-router-dom';



import { Outlet } from 'react-router-dom';
import { fetchPost } from '../lib/loaders';

export async function loader() {
  const posts = await fetchPost();
  return posts ;
}

export default function Home() {
  const posts = useLoaderData() as { image: string; user: string; message: string; }[];
  return (
    <>
    <Card_Post />
    <div>
      {
      posts.map((post) => (
      <Card_text
      
        userImage={post.image}
        username={post.user}
        message={post.message}
      
      />

      

      ))
      }
      
    </div>
      
    </>
  );
}
