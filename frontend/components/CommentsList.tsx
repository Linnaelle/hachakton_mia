/**
 * Composant pour afficher une liste de commentaires
 * Montre les commentaires associés à un tweet avec diverses états (chargement, vide)
 */
'use client';

import Link from 'next/link';

/**
 * Composant de liste de commentaires
 * @param {Object} props - Propriétés du composant
 * @param {Array} props.comments - Liste des commentaires à afficher
 * @param {boolean} props.loading - État de chargement des commentaires
 * @returns {JSX.Element} - Composant rendu
 */
export default function CommentsList({ comments = [], loading = false }) {

    // Affichage d'un indicateur de chargement
    if (loading) {
        return (
            <div className="flex justify-center py-5">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Affichage d'un message si aucun commentaire n'est disponible
    if (!comments || comments.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                <p className="text-lg">No comments yet</p>
                <p className="mt-2 text-sm">Comments you make on tweets will appear here.</p>
            </div>
        );
    }

    /**
     * Formate une date en chaîne lisible
     * @param {string|number|Date} dateString - Date à formater
     * @returns {string} Date formatée
     */
    const formatDate = (dateString: string | number | Date) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return dateString;
        }
    };

    // Rendu de la liste de commentaires
    return (
        <div className="space-y-4">
            {comments.map(comment => (
                <div key={comment.id} className="p-4 border-b hover:bg-gray-50 transition-colors">
                    <div className="flex gap-3">
                        {/* Image de profil de l'auteur */}
                        <img
                            src={comment.author?.profile_img || "/placeholder-profile.jpg"}
                            alt={`${comment.author?.username}'s profile`}
                            className="w-10 h-10 rounded-full object-cover"
                        />

                        <div className="flex-1">
                            {/* En-tête du commentaire */}
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold">{comment.author?.username}</span>
                                <span className="text-gray-500 text-sm">@{comment.author?.username}</span>
                                <span className="text-gray-500 text-sm">·</span>
                                <span className="text-gray-500 text-sm">{formatDate(comment.createdAt)}</span>
                            </div>

                            {/* Contenu du commentaire */}
                            <p className="mb-3">{comment.content}</p>

                            {/* Aperçu du tweet original */}
                            <div className="mt-2 p-3 bg-gray-100 rounded-lg border border-gray-200">
                                <Link
                                    href={`/tweet/${comment.tweetId}`}
                                    className="block hover:text-blue-500 transition-colors"
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-sm">Replying to</span>
                                        <span className="text-blue-500 text-sm">@{comment.tweet?.author?.username}</span>
                                    </div>
                                    <p className="text-sm text-gray-700">
                                        {comment.tweet?.content?.length > 100
                                            ? `${comment.tweet.content.substring(0, 100)}...`
                                            : comment.tweet?.content}
                                    </p>
                                </Link>
                            </div>

                            {/* Actions sur le commentaire */}
                            <div className="flex gap-6 mt-3 text-gray-500 text-sm">
                                {/* Bouton de réponse - à implémenter dans le futur */}
                                <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                    </svg>
                                    Reply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}