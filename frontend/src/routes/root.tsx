import React from 'react';
import NavBar from '../Component/NavBar';
import Footer from '../Component/Footer';
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
