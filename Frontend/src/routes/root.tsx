import React from 'react';
import NavBar from '../ui/NavBar';
import Footer from '../ui/Footer';
import { Outlet } from 'react-router-dom';


export default function Root() {

  return (
    <>
    <NavBar />
    <section>
      <Outlet 
      
      
      
      />
    </section>
    <Footer />

    </>
  );
}
