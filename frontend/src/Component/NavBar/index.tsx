import React from 'react';
import { Link } from 'react-router-dom';

function isAdmin() {


    const token = localStorage.getItem('token');
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:8080/api/getrole", false); // synchronous request
    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }
    xhr.setRequestHeader("Accept", "application/json");
    xhr.send();

    if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        return response.user.roles.includes("Role_admin");
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
                    to={isAdmin() ? import.meta.env.VITE_URL + `/admin` : "/"}
                >
                    SocialName
                </Link>
            </div>
            <div className="text-base">
                {localStorage.getItem('token') ? (
                    <Link
                        to="/login"
                        className="text-warmrasberry hover:text-warmrasberry-hover"
                        
                        onClick={() => {
                            localStorage.removeItem('token');
                            window.alert("Vous avez était deconnecté avec succès");
                            window.location.href = '/login';
                        }}
                    >
                        Logout
                    </Link>
                ) : (
                    <Link
                        to="/login"
                        className="text-warmrasberry hover:text-warmrasberry-hover"
                    >
                        Connexion
                    </Link>
                )}
            </div>
            </div>
        </nav>
    </>
    );

}

