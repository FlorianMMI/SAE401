import React from "react";
import { Link } from "react-router-dom";


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
    };

    return (
        <>
            <section className="flex justify-center items-center bg-candypink py-5 my-5 mx-12 rounded-xl">
                <form className="flex flex-col items-center space-y-4" action="POST">
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
                        <button className="bg-warmrasberry rounded px-7 py-2 text-lg text-white">
                            Post
                        </button>
                    </div>
                </form>
            </section>
        </>
    );
}
