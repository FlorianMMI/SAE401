import React from 'react';
import { RiMapPinLine } from 'react-icons/ri';
import { FaLink } from 'react-icons/fa';


export default function ProfilData(){
    return (
        <>
            <div className="text-center font-sans mt-5">
                <h2 className="text-2xl font-bold">USER</h2>
                <div className="flex justify-center gap-32 mt-5">
                    <div className="flex flex-col items-center w-24">
                        <p className="text-xl m-0">N/A</p>
                        <p className="font-bold m-0">Suivis</p>
                    </div>
                    <div className="flex flex-col items-center w-24">
                        <p className="text-xl m-0">N/A</p>
                        <p className="font-bold m-0">Followers</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center mt-3">
                <p className="text-xl font-bold">Description</p>
                <p className="text-sm text-center w-3/4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae purus nec nunc ultricies aliquet</p>
            </div>

            <div className="flex flex-col items-center mt-3">
                <div className="flex items-center gap-1">
                    <FaLink className="text-lg" />
                    <a href="https://example.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        https://example.com
                    </a>
                </div>
                <div className="flex items-center gap-1 mt-1">
                    <RiMapPinLine className="text-lg" />
                    <p className="text-sm">Paris, France</p>
                </div>
            </div>
        </>
    );
}