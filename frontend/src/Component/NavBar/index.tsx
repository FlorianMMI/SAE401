import React from 'react';
import { Link } from 'react-router-dom';



export async function isAdmin(){
    const token = localStorage.getItem('token');
    if (token == null) {
        return false;
    }
    try {
        const response = await fetch(import.meta.env.VITE_URL + `/api/getrole`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            await response.json();
            return true;
        } else {
            console.error('Erreur lors de la récupération du rôle:', response.status);
            return false;
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du rôle:', error);
        return false;
    }
}


export default function NavBar() {
    const [isAdminUser, setIsAdminUser] = React.useState<boolean>(false);

    React.useEffect(() => {
        async function checkAdmin() {
            const result = await isAdmin();
            setIsAdminUser(result);
        }
        checkAdmin();
    }, []);
    <>
        <nav className="sticky top-0 flex w-full items-center bg-orangepale py-3 shadow-dark-mild">
            <div className="flex w-full items-center justify-between px-2 mx-2">
            <div className="text-base">
                <Link
                    className="text-warmrasberry hover:text-warmrasberry-hover"
                    to={isAdminUser ? import.meta.env.VITE_URL + `/admin` : import.meta.env.VITE_URL + `/`}
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

