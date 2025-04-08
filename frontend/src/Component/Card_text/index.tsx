import React from "react";
import Likes from "../../ui/likes";
import Poubelle from "../../ui/poubelle";
import Bulle from "../../ui/bulle";
import Modification from "../../ui/modification";
import Avatar from "../../assets/Avatar.svg"; // adjust the path as needed
import { Link } from "react-router-dom";

export interface CardTextProps {
    id: number;
    userImage: string;
    username: string;
    message: string;
    media?: string;
    likes: number;
    user_id: number;
}


export interface replyTextProps {
    id? : number;
    post_id? : number;
    author? : string;
    date? : string;
    message? : string;
} 

let test: replyTextProps[] = []


export async function fetchReplies(postId: number): Promise<replyTextProps[]> {
    try {
        const response = await fetch(`http://localhost:8080/post/${postId}/reply`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error("Failed to fetch replies");
        }
        const replies = await response.json();
        console.log("Replies fetched successfully:", replies.replies[0]);
        if (replies.replies[0] !== undefined){
        test.push(replies.replies[0])
        }
        console.log(test)
        return replies.replies[0];
    } catch (error) {
        console.error("Error fetching replies:", error);
        return [];
    }
}

// console.log(await fetchReplies(53)); // Test fetchReplies function

async function isconnected(){
    if (localStorage.getItem('token')){
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:8080/api/getidmessage', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });
            const data = await response.json();
            return { user: data.user.id};
        } catch (error) {
            return false;
        }
    }
    return false;
};

async function isFollowed(user_id: number){
    if (localStorage.getItem('token')){
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:8080/user/${user_id}/is-following/`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });
            const data = await response.json();
            return data.isFollowing === true;
        } catch (error) {
            return false;
        }
    }
    return false;
}

export default function Card_text({ userImage, username, message, likes, id, user_id, media }: CardTextProps ) {
    
    const [isOwner, setIsOwner] = React.useState<boolean>(false);
    const [isFollowing, setIsFollowed] = React.useState<boolean>(false);
    const [isEditing, setIsEditing] = React.useState<boolean>(false);
    const [editedMessage, setEditedMessage] = React.useState<string>(message);
    const [mediaAction, setMediaAction] = React.useState<string>("none");
    const [isFetching, setIsFetching] = React.useState<boolean>(false);

    // États pour la réponse
    const [showReplyForm, setShowReplyForm] = React.useState<boolean>(false);
    const [replyMessage, setReplyMessage] = React.useState<string>("");
    const [replies, setReplies] = React.useState<replyTextProps[]>([]);
    const [repliesFetched, setRepliesFetched] = React.useState<boolean>(false);

    

    React.useEffect(() => {
        async function checkStatus() {
            const [following, connection] = await Promise.all([
                isFollowed(user_id),
                isconnected()
            ]);
            setIsFollowed(!!following);
            setIsOwner(connection && connection.user === user_id);
        }
        checkStatus();
    }, [id, user_id]);

    // Gestion de la réponse
    const toggleReplyForm = () => {
        setShowReplyForm(!showReplyForm);
    };

    const handleReplySubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!replyMessage.trim()) return;

        const newReply: replyTextProps = {
            id: Date.now(),
            author: "Moi", // À remplacer par l'identifiant ou le nom de l'utilisateur connecté
            date: new Date().toLocaleString(),
            message: replyMessage
        };

        setReplies([...replies, newReply]);
        setReplyMessage("");
        setShowReplyForm(false);
    };

    console.log("Replies:", replies , id);

    return (
        <section className="flex flex-row justify-center mx-12 mt-5">
            <div className="flex flex-col items-center justify-center h-full bg-thistlepink py-5 px-10 rounded-xl gap-4 w-[400px]">
                <div className="flex flex-row items-center justify-start w-full">
                    <img
                        className="w-8 h-8 rounded-full"
                        src={ userImage ? `http://localhost:8080/avatar/${userImage}` : Avatar}
                        alt="User profile picture"
                    />
                    <Link to={`/OtherProfil/${user_id}`}>
                        <p className="text-xl text-warmrasberry ml-2">{username}</p>
                    </Link>
                    {!isOwner && (
                        <>
                            {isFollowing ? (
                                <button 
                                    className="ml-auto px-4 py-1 bg-gray-500 text-white rounded-lg text-sm hover:bg-opacity-90 transition-colors"
                                    onClick={async () => {
                                        try {
                                            const token = localStorage.getItem('token');
                                            if (!token) {
                                                console.error("User not authenticated");
                                                return;
                                            }
                                            
                                            const connection = await isconnected();
                                            if (!connection) {
                                                console.error("Failed to get user information");
                                                return;
                                            }
                                            
                                            // Send unfollow request
                                            const response = await fetch('http://localhost:8080/user/unsubscribes', {
                                                method: 'POST',
                                                headers: {
                                                    "Content-Type": "application/json",
                                                    "Authorization": `Bearer ${token}`
                                                },
                                                body: JSON.stringify({
                                                    id: connection.user,
                                                    sub: user_id
                                                })
                                            });
                                            
                                            if (!response.ok) {
                                                throw new Error("Failed to unfollow user");
                                            }
                                            
                                            console.log("Successfully unfollowed user");
                                            window.location.reload();
                                        } catch (error) {
                                            console.error("Error unfollowing user:", error);
                                        }
                                    }}
                                >
                                    Ne plus suivre
                                </button>
                            ) : 
                                <button 
                                    className="ml-auto px-4 py-1 bg-warmrasberry text-white rounded-lg text-sm hover:bg-opacity-90 transition-colors"
                                    onClick={async () => {
                                        try {
                                            const token = localStorage.getItem('token');
                                            if (!token) {
                                                console.error("User not authenticated");
                                                return;
                                            }
                                            
                                            // Get current user id
                                            const connection = await isconnected();
                                            if (!connection) {
                                                console.error("Failed to get user information");
                                                return;
                                            }
                                            
                                            // Send follow request
                                            const response = await fetch('http://localhost:8080/user/subscribes', {
                                                method: 'POST',
                                                headers: {
                                                    "Content-Type": "application/json",
                                                    "Authorization": `Bearer ${token}`
                                                },
                                                body: JSON.stringify({
                                                    id: connection.user,
                                                    sub: user_id
                                                })
                                            });
                                            
                                            if (!response.ok) {
                                                throw new Error("Failed to follow user");
                                            }
                                            
                                            console.log("Successfully followed user");
                                            setIsFollowed(true);
                                            
                                        } catch (error) {
                                            console.error("Error following user:", error);
                                        }
                                    }}
                                >
                                    Suivre
                                </button>
                            }
                        </>
                    )}
                </div>
                <p id="test" className="text-lg text-warmrasberry text-left">
                    {isEditing ? (
                        <>
                            <input
                                type="text"
                                value={editedMessage}
                                onChange={(e) => setEditedMessage(e.target.value)}
                                className="w-full px-2 py-1 border border-warmrasberry rounded-lg"
                            />
                            {media && (
                                <div className="flex flex-col gap-2 mt-2 w-full">
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="px-2 py-1 bg-red-500 text-white text-xs rounded transition-colors hover:bg-red-600 active:scale-95"
                                            onClick={() => {
                                                setMediaAction("delete");
                                                console.log("Media action set to delete");
                                            }}
                                        >
                                            Supprimer l'image
                                        </button>
                                    </div>
                                    <div className="w-full">
                                        <label className="block mb-1 text-sm text-warmrasberry">Remplacer l'image:</label>
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            className="w-full px-2 py-1 text-sm border border-warmrasberry rounded-lg"
                                            id="fileInput"
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="flex gap-2 mt-2">
                                <button
                                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg transition-colors hover:bg-gray-400 active:scale-95"
                                    onClick={() => {
                                        setEditedMessage(message);
                                        setIsEditing(false);
                                    }}
                                >
                                    annuler
                                </button>
                                <button
                                    className="px-3 py-1 bg-warmrasberry text-white rounded-lg transition-colors hover:bg-warmrasberry-hover active:scale-95"
                                    onClick={async () => {
                                        try {
                                            const token = localStorage.getItem('token');
                                            if (!token) {
                                                console.error("User not authenticated");
                                                return;
                                            }
                                            
                                            const formData = new FormData();
                                            formData.append('message', editedMessage);
                                            formData.append('media_action', mediaAction);
                                            console.log("Media action:", mediaAction);
                                            
                                            // Handle file upload if present
                                            const fileInput = document.getElementById('fileInput') as HTMLInputElement;
                                            if (fileInput && fileInput.files && fileInput.files.length > 0) {
                                                formData.append('media', fileInput.files[0]);
                                            }
                                            
                                            const response = await fetch(`http://localhost:8080/post/patch/${id}`, {
                                                method: 'POST',
                                                headers: {
                                                    "Authorization": `Bearer ${token}`
                                                },
                                                body: formData
                                            });
                                            
                                            if (!response.ok) {
                                                throw new Error("Failed to update post");
                                            }
                                            
                                            console.log("Successfully updated post");
                                            window.location.reload();
                                        } catch (error) {
                                            console.error("Error updating post:", error);
                                        } finally {
                                            setIsEditing(false);
                                        }
                                    }}
                                >
                                    confirmer
                                </button>
                            </div>
                        </>
                    ) : (
                        message
                    )}
                </p>

                {media && (
                    <div className="w-full mt-2">
                        {media.endsWith(".mp4") ? (
                            <video
                                controls
                                src={`http://localhost:8080/uploads/${media}`}
                                className="w-full h-auto rounded-lg object-cover max-h-64"
                            />
                        ) : (
                            <img 
                                src={`http://localhost:8080/uploads/${media}`}
                                alt="Post media"
                                className="w-full h-auto rounded-lg object-cover max-h-64"
                                loading="lazy"
                            />
                        )}
                    </div>
                )}

                <div className="w-full flex items-center gap-7 justify-start">
                    <Likes count={likes} id={id} />
                    {isOwner && (
                        <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', padding: 0 }}>
                            <Modification />
                        </button>
                    )}
                    {/* Bouton Répondre */}
                    <button 
                        className="ml-auto  text-white rounded-lg text-sm hover: transition-colors"
                        onClick={toggleReplyForm}
                    >
                        <Bulle></Bulle>
                    </button>
                    {isOwner && (
                        <div
                            className="flex justify-end w-full mt-2"
                            onClick={() => {
                                const tempDiv = document.createElement("div");
                                tempDiv.style.backgroundColor = "var(--color-thistlepink, #FFA500)";
                                tempDiv.style.padding = "20px";
                                tempDiv.style.position = "fixed";
                                tempDiv.style.top = "50%";
                                tempDiv.style.left = "50%";
                                tempDiv.style.transform = "translate(-50%, -50%)";
                                tempDiv.style.boxShadow = "0 0 10px rgba(0,0,0,0.25)";
                                tempDiv.style.zIndex = "1000";
                                tempDiv.style.borderRadius = "12px";

                                const text = document.createElement("p");
                                text.textContent = "Voulez-vous vraiment supprimer ce post ?";
                                text.style.color = "var(--color-warmrasberry, #D62828)";
                                text.style.marginBottom = "20px";

                                const confirmBtn = document.createElement("button");
                                confirmBtn.textContent = "confirmer";
                                confirmBtn.style.marginRight = "10px";
                                confirmBtn.style.padding = "8px 12px";
                                confirmBtn.style.border = "none";
                                confirmBtn.style.borderRadius = "8px";
                                confirmBtn.style.backgroundColor = "var(--color-warmrasberry, #D62828)";
                                confirmBtn.style.color = "white";

                                const cancelBtn = document.createElement("button");
                                cancelBtn.textContent = "annuler";
                                cancelBtn.style.padding = "8px 12px";
                                cancelBtn.style.border = "none";
                                cancelBtn.style.borderRadius = "8px";
                                cancelBtn.style.backgroundColor = "var(--color-warmrasberry, #D62828)";
                                cancelBtn.style.color = "white";

                                tempDiv.appendChild(text);
                                tempDiv.appendChild(confirmBtn);
                                tempDiv.appendChild(cancelBtn);

                                document.body.appendChild(tempDiv);

                                confirmBtn.onclick = async () => {
                                    document.body.removeChild(tempDiv);
                                    try {
                                        const response = await fetch(`http://localhost:8080/post/${id}`, {
                                            method: "DELETE",
                                        });
                                        if (!response.ok) {
                                            throw new Error("Erreur lors de la suppression du post");
                                        }
                                        console.log("Post supprimé avec succès");
                                        window.location.reload();
                                    } catch (error) {
                                        console.error("Une erreur est survenue :", error);
                                    }
                                };

                                cancelBtn.onclick = () => {
                                    document.body.removeChild(tempDiv);
                                };
                            }}
                        >
                            <Poubelle />
                        </div>
                    )}
                </div>
                
                {/* Affichage des réponses */}
                {!repliesFetched && replies.length === 0 ? (
                    <button 
                        disabled={isFetching}
                        onClick={async () => {
                            if (isFetching) return;
                            setIsFetching(true);
                            const fetchedReply = await fetchReplies(id);
                            if (fetchedReply && test.length > 0) {
                                setReplies([...test]);
                            }
                            setRepliesFetched(true);
                            setIsFetching(false);
                        }}
                    >
                        {isFetching ? "Chargement..." : "Afficher les réponses"}
                    </button>
                ) : (
                    <div className="mt-4">
                        <h3 className="text-lg font-bold mb-2">Réponses :</h3>
                        {replies.map((reply, index) => (
                            <div key={reply.id ?? index} className="bg-gray-100 p-2 my-2 rounded">
                                <p className="text-sm font-semibold">{reply.author}</p>
                                <p className="text-xs text-gray-500">{reply.date}</p>
                                <p className="text-md">{reply.message}</p>
                            </div>
                        ))}
                    </div>
                )}
                

                {/* Formulaire de réponse */}
                {showReplyForm && (
                    <form onSubmit={handleReplySubmit} className="w-full mt-4 flex flex-col gap-2">
                        <input
                            type="text"
                            placeholder="Votre réponse..."
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="self-end px-4 py-1 bg-warmrasberry text-white rounded-lg hover:bg-warmrasberry-hover transition-colors"
                        >
                            Publier
                        </button>
                    </form>
                )}

            </div>
        </section>
    );
}
