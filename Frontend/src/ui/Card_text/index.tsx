import { Container } from "postcss";
import React from "react";



export default function Card_text() {

    return (
        <>
            <section className=" flex flex-row justify-center mx-12">

                <div className="flex flex-col items-center justify-center h-full bg-thistlepink mt-10 py-5 px-10 rounded-xl gap-4">
                    <div className="flex flex-row items-center justify-start w-full">
                        <img className="w-8 h-8 rounded-full" src="https://picsum.photos/200/300" alt="Random image from Picsum" />
                        <p className="text-xl text-warmrasberry ml-2">User</p>
                    </div>
                    <text className="text-lg text-warmrasberry">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac nisi ac ante tincidunt scelerisque. Integer euismod, urna in tincidunt pharetra, magna leo suscipit libero, sed vulputate risus nisi non purus. Nulla facilisi. Praesent consqxyz
                    </text>
                </div>

            </section>
        </>
    )


}