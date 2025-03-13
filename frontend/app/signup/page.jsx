/**
 * Page d'inscription utilisateur
 * 
 * Permet aux nouveaux utilisateurs de créer un compte dans l'application
 * 
 * @module SignupPage
 * @requires react
 * @requires next/navigation
 * @requires @heroicons/react
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function SignupPage() {
    // Initialisation du hook de navigation
    const router = useRouter();

    /**
     * État du profil utilisateur
     * Gère les données du formulaire d'inscription
     * 
     * @type {Object} profile - Objet contenant les informations d'inscription
     * @property {string} username - Nom d'utilisateur
     * @property {string} email - Adresse email
     * @property {string} password - Mot de passe
     */
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        password: '',
    });
    
    /**
     * État de gestion des erreurs
     * Stocke et affiche les messages d'erreur lors de l'inscription
     * 
     * @type {string} error - Message d'erreur
     */
    const [error, setError] = useState('');

    /**
     * Gère les changements dans les champs du formulaire
     * Met à jour dynamiquement l'état du profil
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} e - Événement de changement
     */
    function handleChange(e) {
        const { name, value } = e.target;
        // Mise à jour partielle de l'état du profil
        setProfile((prev) => ({ ...prev, [name]: value }));
    }

    /**
     * Gère la soumission du formulaire d'inscription
     * Effectue une requête d'inscription à l'API backend
     * 
     * @param {React.FormEvent<HTMLFormElement>} e - Événement de soumission du formulaire
     */
    async function handleSignup(e) {
        e.preventDefault(); // Empêche le rechargement par défaut du formulaire
        setError(''); // Réinitialisation des messages d'erreur

        try {
            // Envoi de la requête d'inscription à l'API
            const res = await fetch('http://localhost:5000/api/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profile),
            });

            // Analyse de la réponse du serveur
            const data = await res.json();

            // Gestion des erreurs de réponse
            if (!res.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // Redirection vers la page de connexion en cas de succès
            router.push('/login');
        } catch (err) {
            // Journalisation de l'erreur et mise à jour de l'état d'erreur
            console.log(err)
            setError(err.message);
        }
    }

    /**
     * Rendu du composant de page d'inscription
     * 
     * @returns {JSX.Element} Formulaire d'inscription
     */
    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 flex items-center justify-center pt-22">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
                {/* En-tête avec bouton de retour */}
                <div className="relative flex items-center justify-center mb-6">
                    <button onClick={() => router.push('/')} className="absolute left-0">
                        <ArrowLeftIcon className="w-6 h-6 text-gray-600 hover:text-gray-800 transition" />
                    </button>
                    <h1 className="text-2xl font-bold text-center text-gray-800">Sign Up</h1>
                </div>

                {/* Formulaire d'inscription */}
                <form onSubmit={handleSignup}>
                    {/* Affichage conditionnel des messages d'erreur */}
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    {/* Champ de nom d'utilisateur */}
                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={profile.username}
                            onChange={handleChange}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Champ d'email */}
                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={profile.email}
                            onChange={handleChange}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Champ de mot de passe */}
                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={profile.password}
                            onChange={handleChange}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Bouton de soumission */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
}