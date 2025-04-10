import React from 'react';
import { Link } from 'react-router-dom';






export default function NavBar() {
    const [isAdminUser, setIsAdminUser] = React.useState<boolean>(false);

    
    <>
        <nav className="sticky top-0 flex w-full items-center bg-orangepale py-3 shadow-dark-mild">
            <div className="flex w-full items-center justify-between px-2 mx-2">
            <div className="text-base">
                <Link
                    className="text-warmrasberry hover:text-warmrasberry-hover"
                    to={import.meta.env.VITE_URL + `/`}
                >
                    Lofly
                </Link>
            </div>
            <div className="text-base">
                {localStorage.getItem('token') ? (
                    <Link
                        to={import.meta.env.BASE_URL + `/login`}
                        className="text-warmrasberry hover:text-warmrasberry-hover"
                        
                        onClick={() => {
                            localStorage.removeItem('token');
                            window.alert("Vous avez était deconnecté avec succès");
                        }}
                    >
                        Logout
                    </Link>
                ) : (
                    <Link
                        to={import.meta.env.BASE_URL + `/login`}
                        className="text-warmrasberry hover:text-warmrasberry-hover"
                    >
                        Connexion
                    </Link>
                )}
            </div>
            </div>
        </nav>
    </>
    

}

