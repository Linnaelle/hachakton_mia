/**
 * Composant de barre latérale
 * Affiche une navigation principale et des liens vers les différentes sections de l'application
 * @returns {JSX.Element} - Composant rendu
 */
import { HomeIcon, HashtagIcon, BellIcon, EnvelopeIcon, UserIcon } from '@heroicons/react/24/outline';
import SuggestedProfiles from "./SuggestedProfiles";

export default function Sidebar() {
    return (
        <div className="w-72 min-h-screen p-6 border-r bg-white shadow-md pt-11">
            {/* Navigation principale */}
            <nav className="space-y-3">
                {/* Liste des éléments de navigation avec leurs icônes */}
                {[
                    { icon: <HomeIcon className="h-6 w-6" />, text: "Accueil" },
                    { icon: <HashtagIcon className="h-6 w-6" />, text: "Explorer" },
                    { icon: <BellIcon className="h-6 w-6" />, text: "Notifications" },
                    { icon: <EnvelopeIcon className="h-6 w-6" />, text: "Messages" },
                    { icon: <UserIcon className="h-6 w-6" />, text: "Profil" }
                ].map((item, index) => (
                    <button
                        key={index}
                        className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-100 w-full transition-all text-gray-900 font-medium"
                    >
                        {item.icon}
                        <span className="text-lg">{item.text}</span>
                    </button>
                ))}
            </nav>
            {/* Note: Le composant SuggestedProfiles est importé mais non utilisé dans ce rendu */}
        </div>
    );
}