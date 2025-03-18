import React from 'react';
import { Link } from 'react-router-dom';


export default function NavBar() {

    return (
    <>
        <nav className="sticky top-0 flex w-full items-center bg-orangepale py-7 shadow-dark-mild">
            <div className="flex w-full items-center justify-between px-3 mx-4">
            <div className="text-xl">
                <Link className="text-warmrasberry hover:text-warmrasberry-hover" to="/">SocialName</Link>
            </div>
            <div className="text-xl">
                <a className="text-warmrasberry hover:text-warmrasberry-hover" href="">Logout</a>
            </div>
            </div>
        </nav>
    </>
    );

}

