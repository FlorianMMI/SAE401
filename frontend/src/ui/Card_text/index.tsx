import { Container } from "postcss";
import React from "react";



export interface CardTextProps {
    userImage: string;
    username: string;
    message: string;
}

export default function Card_text({ userImage, username, message }: CardTextProps) {
    return (
        <section className="flex flex-row justify-center mx-12">
            <div className="flex flex-col items-center justify-center h-full bg-thistlepink mt-10 py-5 px-10 rounded-xl gap-4">
                <div className="flex flex-row items-center justify-start w-full">
                    <img
                        className="w-8 h-8 rounded-full"
                        src={userImage}
                        alt="User profile picture"
                    />
                    <p className="text-xl text-warmrasberry ml-2">{username}</p>
                </div>
                <p className="text-lg  text-warmrasberry">
                    {message}
                </p>
            </div>
        </section>
    );
}