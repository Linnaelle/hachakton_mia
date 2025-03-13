/**
 * Page de récupération de mot de passe
 * Permet à l'utilisateur de demander un lien de réinitialisation de mot de passe
 */
'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Composant de la page de demande de réinitialisation de mot de passe
 * @returns {JSX.Element} - Composant rendu
 */
export default function ForgotPasswordPage() {
    // États pour gérer le formulaire et les messages
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // Hook pour la navigation
    const router = useRouter()

    /**
     * Gestion de la soumission du formulaire
     * @param {FormEvent<HTMLFormElement>} e - Événement de soumission du formulaire
     */
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // Réinitialisation des messages
        setError('')
        setSuccess('')
        setIsLoading(true)

        try {
            // Appel à l'API pour demander un lien de réinitialisation
            const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            })

            const data = await response.json()

            // Gestion des erreurs de l'API
            if (!response.ok) {
                throw new Error(data.message || 'Échec de l\'envoi du lien de réinitialisation')
            }

            // Affichage du message de succès
            setSuccess('Un lien de réinitialisation de mot de passe a été envoyé à votre email.')
            
            // Redirection vers la page de connexion après 3 secondes
            setTimeout(() => {
                router.push('/login')
            }, 3000)

        } catch (error: unknown) {
            // Gestion des erreurs
            if (error instanceof Error) {
                setError(error.message)
            } else {
                setError('Une erreur inattendue est survenue')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 pt-22 flex items-center justify-center">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Mot de passe oublié</h1>

                {/* Affichage des messages d'erreur */}
                {error && (
                    <div className="text-red-500 text-sm text-center mb-4">
                        {error}
                    </div>
                )}

                {/* Affichage des messages de succès */}
                {success && (
                    <div className="text-green-500 text-sm text-center mb-4">
                        {success}
                    </div>
                )}

                {/* Formulaire de demande de réinitialisation */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-600">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Bouton de soumission */}
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                        {isLoading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
                    </button>
                </form>

                {/* Lien de retour à la page de connexion */}
                <div className="mt-4 text-center">
                    <a href="/login" className="text-sm text-blue-500 hover:underline">Retour à la connexion</a>
                </div>
            </div>
        </div>
    )
}