// context/AppContext.tsx
'use client';

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../type/user';

interface AppContextType {
    query: string;
    setQuery: (query: string) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    error: Error | null;
    setError: (error: Error | null) => void;
    appState: AppState;
    setAppState: (appState: AppState) => void;
    setUser: (user: User | null, token: string | null) => void;
}

interface AppState {
    theme: string;
    user: User | null;
    isLoggedIn: boolean;
    token: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Retrieve data from localStorage or use default values
    const getInitialState = () => {
        let savedState;
        if (typeof window !== 'undefined') {
            savedState = localStorage.getItem('appState');
        }
        return savedState
            ? JSON.parse(savedState)
            : {
                theme: 'light',
                user: null,
                isLoggedIn: false,
                token: null,
            };
    };
    const [appState, setAppState] = useState<AppState>(getInitialState);

    // Function to update the user
    const setUser = (user: User | null, token: string | null) => {
        setAppState((prevState: AppState) => ({
            ...prevState,
            user,
            token,
            isLoggedIn: !!user,
        }));
    };

    useEffect(() => {
        localStorage.setItem('appState', JSON.stringify(appState));
        console.log('state updated');
        console.log(appState);
    }, [appState]);

    return (
        <AppContext.Provider
            value={{
                query,
                setQuery,
                isLoading,
                setIsLoading,
                error,
                setError,
                appState,
                setAppState,
                setUser
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

// Custom hook to use the AppContext
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};