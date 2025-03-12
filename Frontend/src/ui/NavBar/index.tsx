import React from 'react';


export default function NavBar() {

    return (
    <>
        <nav className="sticky top-0 flex w-full items-center bg-orange-300 py-7 shadow-dark-mild">
            <div className="flex w-full items-center justify-between px-3 mx-4">
          <div className="text-purple-900 text-xl">
              <a className="text-[var(--clr-orange)]" href="/">SocialName</a>
          </div>
          <div className="text-purple-900 text-xl">
              <a className="hover:text-[var(--clr-orange)] focus:text-[var(--clr-orange)]" href="">Logout</a>
          </div>
            </div>
        </nav>
    </>
    );

}

