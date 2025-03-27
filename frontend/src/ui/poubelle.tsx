import React from 'react';

export default function poubelle() {
  return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-gray-700 hover:text-red-500 cursor-pointer"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
        {/* Couvercle de la poubelle */}
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4h18M8 4V2h8v2"
        />
        {/* Corps de la poubelle */}
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 11v6m4-6v6"
        />
    </svg>
  );
}