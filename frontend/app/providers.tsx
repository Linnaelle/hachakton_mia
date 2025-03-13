/**
 * Fournisseur Apollo pour l'application
 * Configuration du client Apollo pour les requêtes GraphQL
 * Note: Ce fichier est une alternative à ApolloProviderWrapper.tsx
 */
"use client"

import { ApolloProvider, InMemoryCache, ApolloClient } from "@apollo/client"
 
/**
 * Configuration d'une instance Apollo Client
 * Définit l'URL du serveur GraphQL et les options du cache
 */
const client = new ApolloClient({
  uri: "http://localhost:4000/graphql", // URL du serveur GraphQL
  cache: new InMemoryCache(),           // Cache en mémoire pour les résultats des requêtes
  credentials: "include",               // Inclut les cookies dans les requêtes pour l'authentification
});
 
/**
 * Composant fournisseur Apollo
 * Enveloppe les composants enfants avec le contexte Apollo Client
 * 
 * @param {Object} props - Propriétés du composant
 * @param {React.ReactNode} props.children - Composants enfants
 * @returns {JSX.Element} - Fournisseur Apollo configuré
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}