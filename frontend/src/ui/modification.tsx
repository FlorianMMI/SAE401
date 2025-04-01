import React from 'react';

export default function Modification() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700 hover:text-blue-500 cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            {/* Corps du crayon pour l'édition */}
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16.862 3.487a2.286 2.286 0 113.225 3.225l-9.9 9.9-4.95 1.65a.75.75 0 
                01-.93-.93l1.65-4.95 9.9-9.9z"
            />
            {/* Pointe du crayon */}
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.96 7.04l2.876-2.876a.75.75 0 00-1.045-1.045L16.915 6"
            />
        </svg>
    );
}
