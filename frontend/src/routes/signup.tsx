import React from 'react';
import { Link, redirect } from 'react-router-dom';
import Button from '../ui/button';

export default function Signup() {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [emailError, setEmailError] = React.useState<React.ReactNode | null>(null);
  const [passwordError, setPasswordError] = React.useState<React.ReactNode | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

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

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  // Compute the number of validated password criteria (0 to 4)
  const passwordStrength = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[!@#$%^&*(),.?":{}|<>]/.test(password)
  ].filter(Boolean).length;

  // Calculate a hue from red (0°) to green (120°) based on passwordStrength
  const activeBarColor =
    passwordStrength > 0 ? `hsl(${(passwordStrength / 4) * 120}, 100%, 50%)` : 'transparent';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Vérifier si les validations sont correctes avant d'envoyer la requête
    if (passwordError || emailError || !username) {
      setSubmitError('Veuillez corriger les erreurs du formulaire.');
      return;
    }
    setSubmitError(null);

    const user = {
      username,
      email,
      password,
    };

    try {
      const response = await fetch(import.meta.env.VITE_URL + `/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: user.username, email: user.email, password: user.password }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'inscription');
      }
      // Vous pouvez gérer ici la redirection ou un message de succès
      console.log('Utilisateur inscrit avec succès');
      return redirect('login')
    } catch (error) {
      console.error(error);
      setSubmitError('Une erreur est survenue lors de l\'inscription.');
    }
  };

  return (
    <section className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-semibold text-warmrasberry mb-12">Bienvenue !</h1>
      <form className="w-full max-w-lg" onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="username" className="block text-warmrasberry mb-3">
            Nom d'utilisateur
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={handleUsernameChange}
            className="w-full px-4 py-3 border border-warmrasberry rounded"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="email" className="block text-warmrasberry mb-3">
            Email
          </label>
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
          <label htmlFor="password" className="block text-warmrasberry mb-3">
            Mot de passe
          </label>
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
          {/* Indicateurs de force du mot de passe */}
          <div className="mt-2 flex gap-1">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                style={{
                  height: '8px',
                  flex: 1,
                  backgroundColor: index < passwordStrength ? activeBarColor : '#e0e0e0'
                }}
                className="rounded"
              ></div>
            ))}
          </div>
        </div>
        {submitError && (
          <p className="mb-4 text-red-500 text-sm">{submitError}</p>
        )}
        <div className="flex items-center justify-between gap-4">
        <button className="bg-warmrasberry text-white px-4 py-2 rounded" type="submit">
                        S'inscrire
        </button>
          <Link to= {import.meta.env.BASE_URL + "login"}>
            <Button type="button" variant="secondary">
              Déjà un compte ?
            </Button>
          </Link>
        </div>
      </form>
    </section>
  );
}
