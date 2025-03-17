import React from 'react';



import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';




export default function login() {
  return (
    <>
      <section className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-semibold text-warmrasberry mb-12">Re-Bonjour !</h1>
        <form className="w-full max-w-lg">
          <div className="mb-6">
        <label htmlFor="email" className="block text-warmrasberry mb-3">Email</label>
        <input id="email" type="email" className="w-full px-4 py-3 border border-warmrasberry rounded" />
          </div>
          <div className="mb-8">
        <label htmlFor="password" className="block text-warmrasberry mb-3">Mot de passe</label>
        <input id="password" type="password" className="w-full px-4 py-3 border border-warmrasberry rounded" />
          </div>
          <div className="flex items-center justify-between gap-4">
        <button type="submit" className="bg-warmrasberry text-white py-3 px-6 rounded">Connexion</button>
        <Link to="/signup"><button type="button" className="bg-transparent border border-warmrasberry text-warmrasberry py-3 px-6 rounded">S'inscrire ?</button></Link>
          </div>
        </form>
      </section>
      
    </>
  );
}
