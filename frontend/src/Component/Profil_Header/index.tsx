import React from "react";


interface ProfilHeaderProps {
    avatar?: string;
    images?: string;
}

export default function ProfilHeader({avatar, images}: ProfilHeaderProps) {
    return(
        <>
        
        <div
            className="bg-cover bg-center h-[150px] flex items-center justify-center bg-warmrasberry w-screen"
            style={{ backgroundImage: `url(${images})` }}
        >
            <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-2 border-black">
            {avatar}
            </div>
        </div>
        
        </>
    )
}