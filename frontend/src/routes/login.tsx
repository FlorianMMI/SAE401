import React from 'react';



import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';

import Button from '../ui/button';


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
        <Button
          variant='primary'
          type='submit'
        >
          Connexion
        </Button>
        <Link to="/signup">
          <Button
            type="button"
            variant='secondary'
          >
            S'inscrire ?
          </Button>
        </Link>
          </div>
        </form>
      </section>
      
    </>
  );
}
