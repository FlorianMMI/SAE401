import React from 'react';
import { Link } from 'react-router-dom';

function isAdmin() {


    const token = localStorage.getItem('token');
    if (!token) return false;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:8080/api/getrole", false); // synchronous request
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.send();

    if (xhr.status === 200) {
      console.log(xhr.response);
    }
    
    return false;

}


export default function NavBar() {

    return (
    <>
        <nav className="sticky top-0 flex w-full items-center bg-orangepale py-3 shadow-dark-mild">
            <div className="flex w-full items-center justify-between px-2 mx-2">
            <div className="text-base">
                <Link
                    className="text-warmrasberry hover:text-warmrasberry-hover"
                    to={isAdmin() ? "/admin" : "/"}
                >
                    SocialName
                </Link>
            </div>
            <div className="text-base">
                <a className="text-warmrasberry hover:text-warmrasberry-hover" href="">Logout</a>
            </div>
            </div>
        </nav>
    </>
    );

}

