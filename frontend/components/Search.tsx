/**
 * Composant de recherche
 * Affiche une barre de recherche pour chercher du contenu dans l'application
 * Note: La fonctionnalité de recherche n'est pas encore implémentée
 * @returns {JSX.Element} - Composant rendu
 */
export default function Search() {
  return (
      <div className="sticky top-0 z-10 bg-white w-full p-4 border-b shadow-sm pt-22">
        <div className="relative max-w-4xl mx-auto">
          {/* Champ de saisie pour la recherche */}
          <input
              type="text"
              placeholder="Rechercher sur X"
              className="w-full pl-12 pr-4 py-2 rounded-full bg-gray-100 text-gray-900 border border-gray-300
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white hover:bg-gray-200 transition"
          />
          
          {/* Icône de recherche */}
          <svg
              className="absolute left-4 top-3 h-5 w-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
          >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
  );
}