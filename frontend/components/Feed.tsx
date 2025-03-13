/**
 * Composant Feed
 * Affiche le fil d'actualité principal avec un formulaire pour poster de nouveaux tweets
 * et une liste de tweets existants
 */
"use client";

import { useState, useRef, useCallback } from "react";
import { useQuery, gql } from "@apollo/client";
import { Image, FileImage, Smile, BarChart, MapPin, Camera } from "lucide-react";
import TweetsList from "./TweetList";
import Tabs from "./Tabs";
import { useAppContext } from "@/app/context/appContext";

/**
 * Requête GraphQL pour récupérer les tweets de la timeline
 */
const GET_TWEETS = gql`
  query GetTweets {
    getTimeline {
      id
      content
      media
      likes
      retweets
      isRetweet
      isRetweeted
      isLiked
      isFollowing
      createdAt
      comments
      author {
        profile_img
        id
        username
      }
    }
  }
`;

/**
 * Composant principal du fil d'actualité
 * @returns {JSX.Element} - Composant rendu
 */
export default function Feed() {
  // États pour gérer les onglets et la création de tweets
  const [activeTab, setActiveTab] = useState("forYou");
  const [activeTabTyped, setActiveTabTyped] = useState("forYou");
  const [newTweet, setNewTweet] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Référence pour l'input de fichier caché
  const fileInputRef = useRef(null);
  
  // Contexte global de l'application
  const { appState } = useAppContext();

  // Types de médias acceptés pour l'upload
  const [mediaTypes] = useState("image/*,video/*");

  /**
   * Exécution de la requête GraphQL pour récupérer les tweets
   * Utilisation de cache-and-network pour toujours avoir des données à jour
   */
  const { data, loading, error } = useQuery(GET_TWEETS, {
    fetchPolicy: "cache-and-network",
  });

  /**
   * Gère la sélection d'un fichier média
   * @param {React.ChangeEvent<HTMLInputElement>} e - Événement de changement
   */
  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setFilePreview(URL.createObjectURL(file));
  }, []);

  /**
   * Déclenche le clic sur l'input de fichier caché
   */
  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  /**
   * Supprime le fichier sélectionné et son aperçu
   */
  const removeSelectedFile = useCallback(() => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  /**
   * Gère la publication d'un nouveau tweet via l'API REST
   */
  const handlePostTweet = useCallback(async () => {
    // Vérification qu'il y a du contenu à publier
    if (!newTweet.trim() && !selectedFile) return;
    setIsLoading(true);
    
    try {
      // Préparation du FormData pour l'envoi des données multipart (texte + fichier)
      const formData = new FormData();
      formData.append("content", newTweet);
      if (selectedFile) formData.append("media", selectedFile);
      
      // Appel à l'API REST pour créer le tweet
      const response = await fetch("http://localhost:5000/api/tweets", {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${appState.token}` },
      });
      
      if (!response.ok) throw new Error(await response.text());
      
      // Réinitialisation du formulaire après publication réussie
      setNewTweet("");
      removeSelectedFile();
    } catch (error) {
      console.error("Error posting tweet:", error);
    } finally {
      setIsLoading(false);
    }
  }, [newTweet, selectedFile, removeSelectedFile, appState.token]);

  // Rendu du composant
  return (
      <div className="flex justify-center w-full">
        <div className="max-w-lg w-full bg-white shadow-md rounded-lg p-4">
          {/* Onglets pour basculer entre différentes vues */}
          <Tabs setActiveTab={setActiveTabTyped} activeTab={activeTabTyped} />
          
          {/* Affichage des erreurs de requête */}
          {error && <div className="bg-red-500 text-white p-2 rounded mb-2">{error.message}</div>}
          
          {/* Formulaire de création de tweet */}
          <div className="p-4 rounded-lg border border-gray-300 bg-gray-50">
            <textarea
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="What's happening?"
                value={newTweet}
                onChange={(e) => setNewTweet(e.target.value)}
                disabled={isLoading}
            />
            
            {/* Aperçu du média sélectionné */}
            {filePreview && (
                <div className="relative mt-2 mb-2">
                  {selectedFile.type.startsWith("image/") ? (
                      <img src={filePreview} alt="Preview" className="w-full max-h-80 rounded-lg object-contain" />
                  ) : (
                      <video src={filePreview} controls className="w-full max-h-80 rounded-lg" />
                  )}
                  <button
                      onClick={removeSelectedFile}
                      className="absolute top-2 right-2 bg-gray-900 bg-opacity-70 rounded-full p-1 text-white"
                  >
                    ✕
                  </button>
                </div>
            )}
            
            {/* Input caché pour la sélection de fichier */}
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept={mediaTypes} className="hidden" />
            
            {/* Barre d'actions du formulaire */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex space-x-3 text-blue-500">
                {/* Boutons pour les différentes actions (tous déclenchent l'upload de fichier pour simplifier) */}
                {[Image, FileImage, BarChart, Smile, Camera, MapPin].map((Icon, index) => (
                    <button key={index} className="hover:text-blue-400" onClick={triggerFileInput}>
                      <Icon size={20} />
                    </button>
                ))}
              </div>
              
              {/* Bouton de publication */}
              <button
                  className={`px-4 py-2 rounded text-white ${newTweet.trim() || selectedFile ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
                  onClick={handlePostTweet}
                  disabled={!newTweet.trim() && !selectedFile || isLoading}
              >
                {isLoading ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
          
          {/* Liste des tweets */}
          <TweetsList tweets={data?.getTimeline || []} loading={loading} />
        </div>
      </div>
  );
}