import React from 'react';

export default function Bulle() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700 hover:text-warmrasberry cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            {/* Contour de la bulle */}
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 15h.01M12 15h.01M16 15h.01M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.5 8.5 0 018 8z"
            />
        </svg>
    );
}
