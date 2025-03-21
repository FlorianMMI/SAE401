import React from 'react';
import { Link } from 'react-router-dom';


export default function NavBar() {

    return (
    <>
        <nav className="sticky top-0 flex w-full items-center bg-orangepale py-3 shadow-dark-mild">
            <div className="flex w-full items-center justify-between px-2 mx-2">
            <div className="text-base">
                <Link className="text-warmrasberry hover:text-warmrasberry-hover" to="/">SocialName</Link>
            </div>
            <div className="text-base">
                <a className="text-warmrasberry hover:text-warmrasberry-hover" href="">Logout</a>
            </div>
            </div>
        </nav>
    </>
    );

}

