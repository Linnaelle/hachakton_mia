/**
 * Interface pour les propriétés du composant Tabs
 * @interface TabsProps
 */
interface TabsProps {
    setActiveTab: React.Dispatch<React.SetStateAction<'forYou' | 'following'>>;
    activeTab: 'forYou' | 'following';
}

/**
 * Composant d'onglets pour basculer entre différentes vues du fil d'actualité
 * Permet de basculer entre "Pour vous" et "Abonnements"
 * 
 * @param {TabsProps} props - Propriétés du composant
 * @param {Function} props.setActiveTab - Fonction pour changer l'onglet actif
 * @param {string} props.activeTab - Onglet actuellement actif
 * @returns {JSX.Element} - Composant rendu
 */
export default function Tabs({ setActiveTab, activeTab }: TabsProps) {
    return (
        <div className="sticky top-0 bg-white border-b border-gray-300 z-10">
            <div className="flex">
                {/* Onglet "For you" */}
                <button
                    onClick={() => setActiveTab('forYou')}
                    className={`flex-1 py-5 font-medium transition-colors ease-in-out duration-200 ${
                        activeTab === 'forYou'
                            ? 'text-black border-b-4 border-blue-500'  // Style pour l'onglet actif
                            : 'text-gray-600'                           // Style pour l'onglet inactif
                    } hover:bg-gray-100`}
                >
                    For you
                </button>

                {/* Onglet "Following" */}
                <button
                    onClick={() => setActiveTab('following')}
                    className={`flex-1 py-5 font-medium transition-colors ease-in-out duration-200 ${
                        activeTab === 'following'
                            ? 'text-black border-b-4 border-blue-500'  // Style pour l'onglet actif
                            : 'text-gray-600'                           // Style pour l'onglet inactif
                    } hover:bg-gray-100`}
                >
                    Following
                </button>
            </div>
        </div>
    );
}