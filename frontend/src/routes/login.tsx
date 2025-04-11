import React, { useState } from 'react';
import { Outlet, Link, redirect, Navigate } from 'react-router-dom';
import Button from '../ui/button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      
      const response = await fetch( import.meta.env.VITE_URL + `/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toString() , password: password.toString() }),
      });
      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        localStorage.setItem('token', token);
        window.alert("Vous avez été connecté avec succès");
        window.location.href = import.meta.env.BASE_URL;
      } else {
        console.error('Erreur lors de la connexion:', response.status);
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError(true);
    }
  };

  return (
    <>
      <section className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-semibold text-warmrasberry mb-12">Re-Bonjour !</h1>
        <form className="w-full max-w-lg" onSubmit={handleSubmit}>
          <div className="mb-6">
          {error && (
          <p className="mb-4 text-red-600">
          Email ou mot de passe incorrect
            </p>
          )}
            <label htmlFor="email" className="block text-warmrasberry mb-3">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-warmrasberry rounded"
            />
          </div>
          <div className="mb-8">
            <label htmlFor="password" className="block text-warmrasberry mb-3">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-warmrasberry rounded"
            />
          </div>
          <div className="flex items-center justify-between gap-4">
        
              <button type="submit" className="px-4 py-3 bg-warmrasberry text-white rounded">
              Connexion
              </button>
            
            <Link to= {import.meta.env.BASE_URL + "signup"}>
              <Button type="button" variant="secondary">
                S'inscrire ?
              </Button>
            </Link>
          </div>
        </form>
      </section>
    </>
  );
}
