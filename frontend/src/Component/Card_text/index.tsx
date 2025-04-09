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
    blockedby: boolean;
    login: number;
}


export interface replyTextProps {
    id? : number;
    post_id? : number;
    author? : string;
    created_at? : string;
    message? : string;
} 

let test: replyTextProps[] = []


export async function fetchReplies(postId: number): Promise<replyTextProps[]> {
    try {
        const response = await fetch(import.meta.env.VITE_URL + `/post/${postId}/reply`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error("Failed to fetch replies");
        }
        const replies = await response.json();
        
        return replies.replies;
    } catch (error) {
        console.error("Error fetching replies:", error);
        return [];
    }
}



export default function Card_text({ userImage, username, message, likes, id, user_id, media, blockedby, login }: CardTextProps ) {
    
    const [isOwner, setIsOwner] = React.useState<boolean>(false);
    
    const [isEditing, setIsEditing] = React.useState<boolean>(false);
    const [editedMessage, setEditedMessage] = React.useState<string>(message);
    const [mediaAction, setMediaAction] = React.useState<string>("none");
    const [isFetching, setIsFetching] = React.useState<boolean>(false);

    // États pour la réponse
    const [showReplyForm, setShowReplyForm] = React.useState<boolean>(false);
    const [replyMessage, setReplyMessage] = React.useState<string>("");
    const [replies, setReplies] = React.useState<replyTextProps[]>([]);
    
    React.useEffect(() => {
        async function loadReplies() {
            const data = await fetchReplies(id);
            setReplies(Array.isArray(data) ? data : data ? [data] : []);
        }
        loadReplies();
    }, [id]);
    const [repliesFetched, setRepliesFetched] = React.useState<boolean>(false);

    React.useEffect(() => {
        async function checkStatus() {
            setIsOwner(login === user_id);
        }
        checkStatus();
    }, [id, user_id]);

    // Gestion de la réponse
    const toggleReplyForm = () => {
        setShowReplyForm(!showReplyForm);
    };

    const handleReplySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!replyMessage.trim()) return;
        let token = localStorage.getItem('token');
        const newReplyData = { message: replyMessage };
        const replyResponse = await fetch(import.meta.env.VITE_URL + `/post/${id}/reply`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(newReplyData)
        });
        if (!replyResponse.ok) {
            console.error("Failed to create reply");
            return;
        }
        const replyResult = await replyResponse.json();
        const newReply: replyTextProps = replyResult.reply;

        setReplies([...replies, newReply]);
        setReplyMessage("");
        setShowReplyForm(false);
    };

    return (
        <section className="flex flex-row justify-center mx-12 mt-5">
            <div className="flex flex-col items-center justify-center h-full bg-thistlepink py-5 px-10 rounded-xl gap-4 w-[400px]">
                <div className="flex flex-row items-center justify-start w-full">
                    <img
                        className="w-8 h-8 rounded-full"
                        src={ userImage ? import.meta.env.VITE_URL + `/avatar/${userImage}` : Avatar}
                        alt="User profile picture"
                    />
                    <Link to={`/OtherProfil/${user_id}`}>
                        <p className="text-xl text-warmrasberry ml-2">{username}</p>
                    </Link>
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
                                            
                                            // Handle file upload if present
                                            const fileInput = document.getElementById('fileInput') as HTMLInputElement;
                                            if (fileInput && fileInput.files && fileInput.files.length > 0) {
                                                formData.append('media', fileInput.files[0]);
                                            }
                                            
                                            const response = await fetch(import.meta.env.VITE_URL + `/post/patch/${id}`, {
                                                method: 'POST',
                                                headers: {
                                                    "Authorization": `Bearer ${token}`
                                                },
                                                body: formData
                                            });
                                            
                                            if (!response.ok) {
                                                throw new Error("Failed to update post");
                                            }
                                            
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
                                src={import.meta.env.VITE_URL + `/uploads/${media}`}
                                className="w-full h-auto rounded-lg object-cover max-h-64"
                            />
                        ) : (
                            <img 
                                src={import.meta.env.VITE_URL + `/uploads/${media}`}
                                alt="Post media"
                                className="w-full h-auto rounded-lg object-cover max-h-64"
                                loading="lazy"
                            />
                        )}
                    </div>
                )}

                <div className="w-full flex items-center gap-7 justify-start">
                    {!blockedby && (
                        <Likes count={likes} id={id} />
                    )}
                    {isOwner && (
                        <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', padding: 0 }}>
                            <Modification />
                        </button>
                    )}
                    {/* Bouton Répondre */}
                    {!blockedby && (
                        <button 
                            className="ml-auto text-white rounded-lg text-sm hover: transition-colors"
                            onClick={toggleReplyForm}
                        >
                            <Bulle />
                        </button>
                    )}
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
                                        const response = await fetch(import.meta.env.VITE_URL + `/post/${id}`, {
                                            method: "DELETE",
                                        });
                                        if (!response.ok) {
                                            throw new Error("Erreur lors de la suppression du post");
                                        }
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
                
                {!repliesFetched && replies.length > 0 ? (
                    <button 
                        disabled={isFetching}
                        onClick={async () => {
                            if (isFetching) return;
                            setIsFetching(true);
                            setRepliesFetched(true);
                            setIsFetching(false);
                        }}
                    >
                        {isFetching ? "Chargement..." : "Afficher les réponses"}
                    </button>
                ) : (
                    replies.length > 0 ? (
                    <div className="mt-4">
                        <h3 className="text-lg font-bold mb-2">Réponses :</h3>
                        
                            <div className="overflow-y-auto max-h-60">
                                {replies.map((reply, index) => (
                                    <div key={reply.id ?? index} className="bg-candypink shadow-md border border-warmrasberry p-4 my-2 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold text-warmrasberry">{reply.author}</span>
                                            <span className="text-xs text-warmrasberry">{reply.created_at}</span>
                                        </div>
                                        <p className="text-base text-warmrasberry">{reply.message}</p>
                                    </div>
                                ))}
                            </div>
                        
                    </div>
                    ) : null
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
