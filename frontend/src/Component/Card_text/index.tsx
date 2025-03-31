import { Container } from "postcss";
import React from "react";
import Likes from "../../ui/likes";
import Poubelle from "../../ui/poubelle";
import { useContext } from "react";




export interface CardTextProps {
    id: number;
    userImage: string;
    username: string;
    message: string;
    likes: number;
    user_id: number;
}

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


export default function Card_text({ userImage, username, message, likes, id, user_id }: CardTextProps) {
    
    const [isOwner, setIsOwner] = React.useState<boolean>(false);
    const [isFollowing, setIsFollowed] = React.useState<boolean>(false);

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

    
    return (
        <section className="flex flex-row justify-center mx-12 mt-5">
            <div className="flex flex-col items-center justify-center h-full bg-thistlepink py-5 px-10 rounded-xl gap-4 w-[400px]">
            <div className="flex flex-row items-center justify-start w-full">
                <img
                className="w-8 h-8 rounded-full"
                src={userImage}
                alt="User profile picture"
                />
                <p className="text-xl text-warmrasberry ml-2">{username}</p>
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
                        ) : (
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
                                        window.location.reload();
                                    } catch (error) {
                                        console.error("Error following user:", error);
                                    }
                                }}
                            >
                                Suivre
                            </button>
                        )}
                    </>
                )}
            </div>
            <p className="text-lg text-warmrasberry text-left">
                {message}
            </p>

            <div className="w-full flex items-center justify-start">
                <Likes count={likes} id={id} />
                {isOwner && (
                <div className="flex justify-end w-full mt-2" onClick={() => {
                const tempDiv = document.createElement("div");
                tempDiv.style.backgroundColor = "var(--color-thistlepink, #FFA500)";
                tempDiv.style.padding = "20px";
                tempDiv.style.position = "fixed";
                tempDiv.style.top = "50%";
                tempDiv.style.left = "50%";
                tempDiv.style.transform = "translate(-50%, -50%)";
                tempDiv.style.boxShadow = "0 0 10px rgba(0,0,0,0.25)";
                tempDiv.style.zIndex = "1000";
                tempDiv.style.borderRadius = "12px"; // Rounded corners

                const text = document.createElement("p");
                text.textContent = "Voulez-vous vraiment supprimer ce post ?";
                text.style.color = "var(--color-warmrasberry, #D62828)"; // Warmrasberry color
                text.style.marginBottom = "20px"; // Ajout d'un gap entre le texte et les boutons

                const confirmBtn = document.createElement("button");
                confirmBtn.textContent = "confirmer";
                confirmBtn.style.marginRight = "10px";
                confirmBtn.style.padding = "8px 12px";
                confirmBtn.style.border = "none";
                confirmBtn.style.borderRadius = "8px"; // Bouton arrondi
                confirmBtn.style.backgroundColor = "var(--color-warmrasberry, #D62828)";
                confirmBtn.style.color = "white";

                const cancelBtn = document.createElement("button");
                cancelBtn.textContent = "annuler";
                cancelBtn.style.padding = "8px 12px";
                cancelBtn.style.border = "none";
                cancelBtn.style.borderRadius = "8px"; // Bouton arrondi
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
                        method: "DELETE"
                    });
                    if (!response.ok) {
                        throw new Error("Erreur lors de la suppression du post");
                    }
                    console.log("Post supprimé avec succès");
                    // Relancer la requête des post
                    window.location.reload();
                    } catch (error) {
                    console.error("Une erreur est survenue :", error);
                    }
                };
                
                cancelBtn.onclick = () => {
                    document.body.removeChild(tempDiv);
                };
                }}>
                <Poubelle />
                </div>
                )}
            </div>
            
            </div>
        </section>
    );
}