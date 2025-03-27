import React, { useState } from 'react';
import { FaHeart } from 'react-icons/fa';

interface LikesProps {
    count: number;
    id : number;
}

const Likes: React.FC<LikesProps> = ({ count: initialCount, id: id }) => {
    const [liked, setLiked] = useState<boolean>(false);
    const [count, setCount] = useState<number>(initialCount);

    const handleClick = () => {
        console.log('id:', id);
        if (liked) {
            setLiked(false);
            fetch(`http://localhost:8080/like/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ increment: -1 }),
            })
              .then(response => {
                  if (response.status === 204) return {};
                  return response.json();
              })
              .then(data => {
                  console.log('Like removed for post:', data);
                  setCount(count - 1);
              })
              .catch(error => console.error('Error removing like:', error));
        } else {
            setLiked(true); 
            fetch(`http://localhost:8080/like/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ increment: 1 }),
            })
              .then(response => {
                  if (response.status === 204) return {};
                  return response.json();
              })
              .then(data => {
                  console.log('Like registered for post:', data);
                  setCount(count + 1);
              })
              .catch(error => console.error('Error registering like:', error));
        }
    };

    const heartStyle: React.CSSProperties = {
        color: liked ? 'red' : 'black',
        marginRight: 8,
        transition: 'color 0.2s',
    };

    return (
        <div
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={handleClick}
        >
            <FaHeart
                style={heartStyle}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'red')}
                onMouseLeave={(e) =>
                    (e.currentTarget.style.color = liked ? 'red' : 'black')
                }
            />
            <span>{count}</span>
        </div>
    );
};

export default Likes;