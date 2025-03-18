import React from 'react';

import HomeLogo from '../../assets/Home.svg';
import AddLogo from '../../assets/Add.svg';
import ProfileLogo from '../../assets/Profil.svg';

import { Link } from 'react-router-dom';


export default function Footer() {

    return (
    <>
        <nav className="fixed bottom-0 w-full flex items-center bg-orangepale py-7 shadow-dark-mild">
            <div className="flex w-full items-center justify-between px-3 mx-4">
          <div className="text-rasberry text-xl">
            <Link to="/"><img src={HomeLogo} alt="Logo" className="h-10" /></Link>
          </div>

          <div className="text-rasberry text-xl">
            <img src={AddLogo} alt="Logo" className="h-10" />
          </div>

          <div className="text-rasberry text-xl">
            <Link to="/login"><img src={ProfileLogo} alt="Logo" className="h-10" /></Link>
          </div>
          
            </div>
        </nav>
    </>
    );

}

