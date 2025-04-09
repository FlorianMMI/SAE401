import React from "react";
import Button from "../../ui/button";
import Media from "../../ui/media";

// Fonction externe pour envoyer le post, avec gestion optionnelle du fichier média
export async function sendPost(message: string, mediaFile?: File): Promise<void> {
    const token = localStorage.getItem("token");
    let response: Response;

    if (mediaFile) {
        const formData = new FormData();
        formData.append("message", message);
        formData.append("media", mediaFile);
        response = await fetch(import.meta.env.VITE_URL + `/posts`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData,
        });
    } else {
        response = await fetch(import.meta.env.VITE_URL + `/posts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ message: message })
        });
    }

    if (!response.ok) {
        throw new Error("Erreur lors de la création du post");
    }
}

export default function Card_Post() {
    const [text, setText] = React.useState("");
    const [error, setError] = React.useState("");
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length <= 280) {
            setText(e.target.value);
            setError(`Caractères restants : ${280 - e.target.value.length}`);
        } else {
            setError("Limite de 280 caractères atteinte");
        }
    };

    // Gestion de la sélection des fichiers multimédias
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await sendPost(text, selectedFile || undefined);
            setText("");
            setSelectedFile(null);
            setPreviewUrl(null);
            setError("Post créé !");
            window.location.reload();
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
                        placeholder="Écrivez ici"
                        className="text-lg border-b border-black bg-transparent focus:outline-none"
                        onChange={handleChange}
                        value={text}
                    />
                </div>
                {/* Bouton pour sélectionner un fichier multimédia */}
                <div className="flex flex-col items-center">
                    <label htmlFor="media-upload" style={{ cursor: "pointer" }} className="flex items-center space-x-2">
                        <Media></Media>
                        <span>Ajouter image/vidéo</span>
                    </label>
                    <input
                        id="media-upload"
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
                </div>
                {previewUrl && (
                    <div style={{ marginTop: "10px" }}>
                        {selectedFile?.type.startsWith("image") ? (
                            <img src={previewUrl} alt="Prévisualisation" style={{ maxWidth: "50%" }} />
                        ) : selectedFile?.type.startsWith("video") ? (
                            <video src={previewUrl} controls style={{ maxWidth: "50%" }} />
                        ) : null}
                    </div>
                )}
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