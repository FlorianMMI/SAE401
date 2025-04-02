import React from 'react';

interface MediaIconProps {
    type?: 'video' | 'audio' | 'image' | 'document';
    size?: 'small' | 'medium' | 'large';
    color?: string;
    className?: string;
}

export default function MediaIcon({ 
    type = 'image', 
    size = 'medium', 
    color = 'currentColor',
    className = ''
}: MediaIconProps) {
    // Calculate dimensions based on size
    const dimensions = {
        small: { width: 16, height: 16 },
        medium: { width: 24, height: 24 },
        large: { width: 32, height: 32 }
    }[size];

    // Icons paths for different media types
    const iconPaths = {
        video: (
            <path d="M8 5v14l11-7z" fill={color} />
        ),
        audio: (
            <>
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" fill={color} />
            </>
        ),
        image: (
            <>
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill={color} />
            </>
        ),
        document: (
            <>
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill={color} />
            </>
        )
    };

    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width={dimensions.width} 
            height={dimensions.height} 
            viewBox="0 0 24 24"
            className={className}
        >
            {iconPaths[type]}
        </svg>
    );
}

// Also exporting as named export for backward compatibility
export { MediaIcon };