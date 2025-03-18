import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/button';

export default function signup() {
  const [password, setPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState<React.ReactNode | null>(null);

  const validatePassword = (pwd: string): React.ReactNode | null => {
    const errors: string[] = [];
    if (pwd.length < 8) errors.push("8 caractères");
    if (!/[A-Z]/.test(pwd)) errors.push("une majuscule");
    if (!/[0-9]/.test(pwd)) errors.push("un chiffre");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) errors.push("un caractère spécial");

    if (errors.length > 0) {
      return (
        <span style={{ whiteSpace: 'pre-line' }}>
          {`Le mot de passe doit contenir au moins :\n${errors.map(err => " - " + err).join('\n')}`}
        </span>
      );
    }
    return null;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState<React.ReactNode | null>(null);

  const validateEmail = (email: string): React.ReactNode | null => {
    const errors: string[] = [];
    if (!/@/.test(email)) errors.push("le caractère @");
    if (!/\.[a-zA-Z]{2,}$/.test(email)) errors.push("un domaine valide (ex: .fr, .com, .org, ...)");

    if (errors.length > 0) {
      return (
        <span style={{ whiteSpace: 'pre-line' }}>
          {`L'email doit être au format Client@hebergeur.fr \n${errors.map(err => " - " + err).join('\n')}`}
        </span>
      );
    }
    return null;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  return (
    <>
      <section className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-semibold text-warmrasberry mb-12">Bienvenue !</h1>
        <form className="w-full max-w-lg">
          <div className="mb-6">
            <label htmlFor="username" className="block text-warmrasberry mb-3">Nom d'utilisateur</label>
            <input id="username" type="text" className="w-full px-4 py-3 border border-warmrasberry rounded" />
          </div>
            <div className="mb-6">
            <label htmlFor="email" className="block text-warmrasberry mb-3">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full px-4 py-3 border border-warmrasberry rounded"
            />
            {emailError && (
              <p className="mt-2 text-red-500 text-sm">{emailError}</p>
            )}
            </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-warmrasberry mb-3">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full px-4 py-3 border border-warmrasberry rounded"
            />
            {passwordError && (
              <p className="mt-2 text-red-500 text-sm">{passwordError}</p>
            )}
            <div className="mt-2 h-2 bg-warmrasberry rounded-full"></div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <Button
              type="submit"
              variant="primary"
            >
              S'inscrire
            </Button>
            <Link to="/login">
                <Button
                  type="button"
                  variant='secondary'
                >
                  Déjà un compte ?
                </Button>
            </Link>
          </div>
        </form>
      </section>
    </>
  );
}
