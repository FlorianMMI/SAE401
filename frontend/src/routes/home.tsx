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
  likes: number;
  user: {
    id: number;
    username: string;
    image?: string;
  };
  message: string;
}

export default function Home() {
  // posts issus du loader
  const initialPosts = useLoaderData() as Post[];
  const [posts, setPosts] = useState<Post[]>(initialPosts || []);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // États liés au rafraîchissement
  const [autoRefresh, setAutoRefresh] = useState(false);
  const refreshInterval = 30000; // 30 secondes

  // Fonction pour charger les anciens posts avec pagination
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const nextPage = page + 1;
    const result = await fetchPost(nextPage);
    if (!result.posts || result.posts.length === 0) {
      setHasMore(false);
    } else {
      setPosts((prev) => [...prev, ...result.posts]);
      setPage(nextPage);
    }
    setLoading(false);
  }, [page, hasMore, loading]);

  // Fonction pour rafraîchir le fil avec les nouveaux posts
  // On récupère la page 1 et on ajoute en haut les posts dont la date est plus récente que le premier post actuel.
  const refreshFeed = useCallback(async () => {
    const result = await fetchPost(1);
    if (result.posts) {
      // Replace all posts with the new ones
      setPosts(result.posts);
      // Reset pagination state
      setPage(1);
      setHasMore(true);
    }
  }, []);

  // Auto-refresh toutes les X secondes si activé
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        refreshFeed();
      }, refreshInterval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refreshFeed]);

  // Détecter le scroll pour charger plus de posts
  useEffect(() => {
    const onScroll = () => {
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
      <div className="my-4 flex items-center justify-between px-4">
        <button
          onClick={refreshFeed}
          className="bg-warmrasberry hover:bg-thistlepink hover:bg-opacity-90 text-white py-2 px-4 rounded transition cursor-pointer"
        >
          Rafraîchir
        </button>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
          />
          <span>Auto rafraîchissement ({refreshInterval / 1000}s)</span>
        </label>
      </div>
      <div className="my-12">
        {posts.map((post) => (
          <Card_text
            key={post.id}
            likes={post.likes}
            id={post.id}
            user_id={post.user.id}
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