import React, { useEffect, useState, useCallback } from 'react';
import Card_text from '../Component/Card_text';
import Card_Post from '../Component/Card_Post';
import { useLoaderData } from 'react-router-dom';
import Avatar from '../assets/Avatar.svg';
import { fetchPost } from '../lib/loaders';

export async function loader() {
  const data = await fetchPost(1);
  console.log('ceci est post', data);
  return data.posts; // initial posts array (or null)
}

interface Post {
  created_at: string;
  id: number;
  user: {
    username: string;
    image?: string;
  };
  message: string;
}

export default function Home() {
  // initial posts from the loader
  const initialPosts = useLoaderData() as Post[];
  const [posts, setPosts] = useState<Post[]>(initialPosts || []);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const nextPage = page + 1;
    const result = await fetchPost(nextPage);
    // Ici, on considère que si result.posts est null ou vide, il n'y a plus de données.
    if (!result.posts || result.posts.length === 0) {
      setHasMore(false);
    } else {
      setPosts((prev) => [...prev, ...result.posts]);
      setPage(nextPage);
    }
    setLoading(false);
  }, [page, hasMore, loading]);

  useEffect(() => {
    const onScroll = () => {
      // Vérifie si on est à 50px du bas
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 50
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [loadMore]);

  return (
    <>
      <Card_Post />
      <div className="my-12">
        {posts.map((post) => (
          <Card_text
            key={post.id}
            userImage={post.user.image || Avatar}
            username={post.user.username}
            message={post.message}
          />
        ))}
        {!hasMore && <p className="text-center">Aucun post supplémentaire.</p>}
      </div>
    </>
  );
}
