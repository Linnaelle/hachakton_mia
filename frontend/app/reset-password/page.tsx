/**
 * Page de réinitialisation de mot de passe
 * 
 * Cette page permet aux utilisateurs de réinitialiser leur mot de passe 
 * après avoir reçu un token de réinitialisation valide.
 * 
 * @module PageReinitialiserMotDePasse
 * @requires react
 * @requires next/navigation
 */
'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function PageReinitialiserMotDePasse() {
    // Gestion des états du formulaire
    const [password, setPassword] = useState('') // Nouveau mot de passe
    const [confirmPassword, setConfirmPassword] = useState('') // Confirmation du mot de passe
    const [error, setError] = useState('') // Message d'erreur
    const [success, setSuccess] = useState('') // Message de succès
    const [isLoading, setIsLoading] = useState(false) // État de chargement de la requête

    // Initialisation des hooks de navigation et de récupération des paramètres
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token') // Extraction du token de réinitialisation depuis l'URL

    /**
     * Vérifie la présence du token de réinitialisation
     * Redirige vers la page de connexion si le token est absent
     */
    useEffect(() => {
        if (!token) {
            router.push('/login')
        }
    }, [token, router])

    /**
     * Gère la soumission du formulaire de réinitialisation de mot de passe
     * 
     * @param {FormEvent<HTMLFormElement>} e - Événement de soumission du formulaire
     */
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault() // Empêche le rechargement par défaut du formulaire
        
        // Réinitialisation des messages d'état
        setError('')
        setSuccess('')

        // Validation de la correspondance des mots de passe
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas')
            return
        }

        // Expression régulière pour la validation de la complexité du mot de passe
        // Critères : 8 caractères min, au moins une majuscule, une minuscule, un chiffre et un caractère spécial
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        if (!passwordRegex.test(password)) {
            setError('Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, une minuscule, un chiffre et un caractère spécial')
            return
        }

        // Activation de l'indicateur de chargement
        setIsLoading(true)

        try {
            // Envoi de la requête de réinitialisation de mot de passe à l'API
            const response = await fetch('http://localhost:5000/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    token, 
                    newPassword: password 
                }),
            })

            // Analyse de la réponse du serveur
            const data = await response.json()

            // Gestion des erreurs de réponse
            if (!response.ok) {
                throw new Error(data.message || 'Échec de la réinitialisation du mot de passe')
            }

            // Affichage du message de succès
            setSuccess('Mot de passe réinitialisé avec succès. Redirection vers la connexion...')
            
            // Redirection différée vers la page de connexion
            setTimeout(() => {
                router.push('/login')
            }, 2000)

        } catch (error: unknown) {
            // Gestion des erreurs de manière robuste
            if (error instanceof Error) {
                setError(error.message)
            } else {
                setError('Une erreur inattendue est survenue')
            }
        } finally {
            // Désactivation de l'indicateur de chargement
            setIsLoading(false)
        }
    }

    /**
     * Rendu du composant de réinitialisation de mot de passe
     * 
     * @returns {JSX.Element} Formulaire de réinitialisation de mot de passe
     */
    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 pt-22 flex items-center justify-center">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
                {/* Titre principal de la page */}
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Réinitialiser le mot de passe</h1>

                {/* Affichage conditionnel des messages d'erreur */}
                {error && (
                    <div className="text-red-500 text-sm text-center mb-4">
                        {error}
                    </div>
                )}

                {/* Affichage conditionnel des messages de succès */}
                {success && (
                    <div className="text-green-500 text-sm text-center mb-4">
                        {success}
                    </div>
                )}

                {/* Formulaire de réinitialisation de mot de passe */}
                <form onSubmit={handleSubmit}>
                    {/* Champ de saisie du nouveau mot de passe */}
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-600">Nouveau mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Champ de confirmation du nouveau mot de passe */}
                    <div className="mb-6">
                        <label htmlFor="confirm-password" className="block text-gray-600">Confirmer le nouveau mot de passe</label>
                        <input
                            type="password"
                            id="confirm-password"
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Bouton de soumission du formulaire */}
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                        {isLoading ? 'Réinitialisation en cours...' : 'Réinitialiser le mot de passe'}
                    </button>
                </form>
            </div>
        </div>
    )
}