/**
 * Contexte global de l'application
 * Gère l'état partagé entre les composants (données utilisateur, thème, etc.)
 */
'use client';

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../type/user';

/**
 * Interface définissant la structure du contexte de l'application
 * @interface AppContextType
 */
interface AppContextType {
    query: string;                                   // Requête de recherche
    setQuery: (query: string) => void;               // Fonction pour définir la requête
    isLoading: boolean;                              // État de chargement global
    setIsLoading: (isLoading: boolean) => void;      // Fonction pour définir l'état de chargement
    error: Error | null;                             // Erreur globale
    setError: (error: Error | null) => void;         // Fonction pour définir l'erreur
    appState: AppState | null;                       // État global de l'application
    setAppState: (appState: AppState) => void;       // Fonction pour définir l'état global
    setUser: (user: User | null, token: string | null) => void; // Fonction pour définir l'utilisateur
}

/**
 * Interface définissant la structure de l'état global de l'application
 * @interface AppState
 */
interface AppState {
    theme: string;           // Thème actuel (light, dark, etc.)
    user: User | null;       // Données de l'utilisateur connecté
    isLoggedIn: boolean;     // Si un utilisateur est connecté
    token: string | null;    // Token d'authentification
}

/**
 * État par défaut de l'application
 */
const defaultState: AppState = {
    theme: 'light',
    user: null,
    isLoggedIn: false,
    token: null,
};

/**
 * Création du contexte avec une valeur initiale undefined
 */
const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * Fournisseur du contexte de l'application
 * @param {Object} props - Propriétés du composant
 * @param {ReactNode} props.children - Composants enfants à envelopper
 * @returns {JSX.Element} - Composant Context.Provider configuré
 */
export const AppProvider = ({ children }: { children: ReactNode }) => {
    // États pour les différentes propriétés du contexte
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [appState, setAppState] = useState<AppState | null>(null);

    /**
     * Effet pour charger l'état depuis localStorage au montage du composant
     * Évite les accès à localStorage pendant le rendu côté serveur (SSR)
     */
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedState = localStorage.getItem('appState');
            setAppState(savedState ? JSON.parse(savedState) : defaultState);
        }
    }, []);

    /**
     * Effet pour sauvegarder l'état dans localStorage à chaque modification
     */
    useEffect(() => {
        if (appState) {
            localStorage.setItem('appState', JSON.stringify(appState));
        }
        console.log(appState)
    }, [appState]);

    /**
     * Met à jour l'utilisateur et le token dans l'état global
     * @param {User|null} user - Utilisateur connecté ou null
     * @param {string|null} token - Token d'authentification ou null
     */
    const setUser = (user: User | null, token: string | null) => {
        setAppState(prevState => ({
            ...prevState!,
            user,
            token,
            isLoggedIn: !!user,
        }));
    };

    // Valeur du contexte à fournir aux composants enfants
    return (
        <AppContext.Provider value={{
            query,
            setQuery,
            isLoading,
            setIsLoading,
            error,
            setError,
            appState: appState ?? defaultState, // Utilise defaultState si appState est null
            setAppState,
            setUser,
        }}>
            {children}
        </AppContext.Provider>
    );
};

/**
 * Hook personnalisé pour utiliser le contexte de l'application
 * @returns {AppContextType} - Le contexte de l'application
 * @throws {Error} - Si utilisé en dehors d'un AppProvider
 */
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};