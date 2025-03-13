/**
 * Page d'accueil de l'application
 * Affiche la structure principale avec la barre latérale, le fil d'actualité et les suggestions
 */
import Sidebar from '../components/Sidebar';
import Feed from '../components/Feed';
import SuggestedProfiles from "../components/SuggestedProfiles";

/**
 * Composant de la page d'accueil
 * Structure la page en trois colonnes : barre latérale, fil d'actualité et suggestions
 * 
 * @returns {JSX.Element} - Composant rendu
 */
export default function Home() {
    return (
        <div className="flex justify-center min-h-screen bg-gray-100 text-black pt-22">
            {/* Conteneur centré avec une largeur maximale */}
            <div className="flex w-full max-w-[1600px]">
                {/* Colonne de gauche : Barre latérale de navigation */}
                <Sidebar />

                {/* Colonne centrale : Fil d'actualité principal */}
                <main className="flex-1 max-w-2xl border-x border-gray-700">
                    <Feed />
                </main>

                {/* Colonne de droite : Profils suggérés (masqués sur petits écrans) */}
                <div className="w-96 hidden lg:block p-4">
                    <SuggestedProfiles />
                </div>
            </div>
        </div>
    );
}