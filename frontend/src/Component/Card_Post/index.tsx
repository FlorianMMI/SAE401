import React from "react";
import Button from "../../ui/button";

// Fonction externe pour envoyer le post
export async function sendPost(message: string): Promise<void> {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:8080/posts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message: message })
    });
    if (!response.ok) {
        throw new Error("Erreur lors de la création du post");
    }
}

export default function Card_Post() {
    const [text, setText] = React.useState("");
    const [error, setError] = React.useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length <= 280) {
            setText(e.target.value);
            setError(`Caractères restants : ${280 - e.target.value.length}`);
        } else {
            setError("Limite de 280 caractères atteinte");
        }
        console.log(text, e.target.value);
    };

    

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {

            await sendPost(text);
            setText("");
            setError("Post créé !");
            // window.location.reload();
        } catch (err: any) {
            setError(err.message);
        }  
    };

    return (
        <section className="flex justify-center items-center bg-candypink py-5 my-2 mx-13 px-8 rounded-xl">
            <form className="flex flex-col items-center space-y-4" onSubmit={handleSubmit}>
                <div className="flex flex-row items-center space-x-4">
                    <img
                        className="w-12 h-12 rounded-full"
                        src="https://picsum.photos/200/300"
                        alt="Random from picsum"
                    />
                    <input
                        type="text"
                        placeholder="Ecrivez ici"
                        className="text-lg border-b border-black bg-transparent focus:outline-none"
                        onChange={handleChange}
                        value={text}
                    />
                </div>
                {error && <p className="text-warmrasberry text-sm">{error}</p>}
        
                <div>
                    <button className="bg-warmrasberry text-white px-4 py-2 rounded" type="submit">
                        Post
                    </button>
                </div>
            </form>
        </section>
    );
}
