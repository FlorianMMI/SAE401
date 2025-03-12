import React from 'react';


export default function NavBar() {

    return (
    <>
        <nav
          className="flex-no-wrap relative flex w-full items-center justify-between bg-zinc-50 py-2 shadow-dark-mild dark:bg-neutral-700 lg:flex-wrap lg:justify-start lg:py-4">
          <div className="flex w-full flex-wrap items-center justify-between px-3"> 
          
            <div className="list-style-none me-auto flex flex-col ps-0 lg:flex-row text-white space-x-10">
          
          <div className="list-style-none me-auto flex flex-col ps-0 lg:flex-row text-white">
            <a className="mb-4 lg:mb-0 lg:pe-2 text-[var(--clr-orange)]" href="/crash">SocialName</a>
          </div>
          
          <div className="list-style-none me-auto flex flex-col ps-0 lg:flex-row text-white space-x-10">
            <a className="ml-15 mb-4 lg:mb-0 lg:pe-2 hover:text-[var(--clr-orange)] focus:text-[var(--clr-orange)]" href="">Logout</a>
          </div>
            
            </div>
            
          </div>
        </nav>
    </>
    );

}

