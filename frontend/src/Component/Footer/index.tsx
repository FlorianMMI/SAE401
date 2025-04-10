import React from 'react';

import HomeLogo from '../../assets/Home.svg';
import AddLogo from '../../assets/Add.svg';
import ProfileLogo from '../../assets/Profil.svg';

import { Link } from 'react-router-dom';


export default function Footer() {

    return (
    <>
        <nav className="fixed bottom-0 w-full flex items-center bg-orangepale py-4 shadow-dark-mild">
          <div className="flex w-full items-center justify-between px-2 mx-2">
            <div className="text-rasberry text-lg">
              <Link to={`${import.meta.env.VITE_SURL}/`}><img src={HomeLogo} alt="Logo" className="h-8" /></Link>
            </div>

            <div className="text-rasberry text-lg">
              <img src={AddLogo} alt="Logo" className="h-8" />
            </div>

            <div className="text-rasberry text-lg">
              <Link to={`${import.meta.env.VITE_SURL}/profile`}><img src={ProfileLogo} alt="Logo" className="h-8" /></Link>
            </div>
          </div>
        </nav>
    </>
    );

}

