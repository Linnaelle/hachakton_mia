"use client";

import { useState, useEffect } from "react";
import { Image, FileImage, Smile, BarChart, MapPin, Camera } from "lucide-react";
import Tweet from "./Tweet";
import Tabs from "./Tabs";

interface TweetData {
  username: string;
  handle: string;
  content: string;
  time: string;
  isFollowing: boolean;
}

export default function Feed() {
  const [activeTab, setActiveTab] = useState<"forYou" | "following">("forYou");
  const [forYouTweets, setForYouTweets] = useState<TweetData[]>([]);
  const [followingTweets, setFollowingTweets] = useState<TweetData[]>([]);
  const [newTweet, setNewTweet] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les tweets depuis l'API
  const fetchTweets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/tweets");
      if (!response.ok) throw new Error("Erreur lors de la récupération des tweets");

      const data = await response.json();
      setForYouTweets(data.forYou || []);
      setFollowingTweets(data.following || []);
    } catch (error) {
      setError("Impossible de charger les tweets.");
      console.error("Erreur lors du chargement des tweets :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  // Fonction pour envoyer un tweet à l'API
  const handlePostTweet = async () => {
    if (!newTweet.trim()) return;

    const newTweetData: TweetData = {
      username: "Current User",
      handle: "@currentuser",
      content: newTweet,
      time: new Date().toLocaleTimeString(),
      isFollowing: false,
    };

    try {
      const response = await fetch("/api/tweets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTweetData),
      });

      if (response.ok) {
        setNewTweet(""); // Réinitialiser le champ
        fetchTweets(); // Recharger les tweets après l'ajout
      } else {
        throw new Error("Erreur lors de l'envoi du tweet");
      }
    } catch (error) {
      setError("Impossible d'envoyer le tweet.");
      console.error("Erreur :", error);
    }
  };

  // Fonction pour gérer le suivi/désabonnement
  const handleFollowToggle = (tweetIndex: number) => {
    setForYouTweets((prevTweets) =>
      prevTweets.map((tweet, index) =>
        index === tweetIndex ? { ...tweet, isFollowing: !tweet.isFollowing } : tweet
      )
    );
  };

  return (
    <div className="flex justify-center w-full">
      <div className="max-w-[600px] w-full">

        <Tabs setActiveTab={setActiveTab} activeTab={activeTab} />

        {/* Afficher un message d'erreur en cas de problème */}
        {error && <div className="bg-red-500 text-white p-2 rounded mb-2">{error}</div>}

        {/* Formulaire de création de tweet */}
        <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg shadow-md mb-4 text-white">
          <textarea
            className="w-full p-2 border border-gray-600 rounded bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500"
            placeholder="What's happening?"
            value={newTweet}
            onChange={(e) => setNewTweet(e.target.value)}
            style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          />

          {/* Boutons fictifs */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex space-x-3 text-blue-400">
              <button className="hover:text-blue-300"><Image size={20} /></button>
              <button className="hover:text-blue-300"><FileImage size={20} /></button>
              <button className="hover:text-blue-300"><BarChart size={20} /></button>
              <button className="hover:text-blue-300"><Smile size={20} /></button>
              <button className="hover:text-blue-300"><Camera size={20} /></button>
              <button className="hover:text-blue-300"><MapPin size={20} /></button>
            </div>

            <button
              className={`px-4 py-2 rounded text-white ${
                newTweet.trim()
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-500 cursor-not-allowed"
              }`}
              onClick={handlePostTweet}
              disabled={!newTweet.trim()}
            >
              Post
            </button>
          </div>
        </div>

        {/* Affichage des tweets */}
        {loading ? (
          <p className="text-center text-gray-400">Chargement des tweets...</p>
        ) : (
          <div className="divide-y divide-gray-600">
            {(activeTab === "following" ? followingTweets : forYouTweets).map((tweet, index) => (
              <Tweet
                key={index}
                username={tweet.username}
                handle={tweet.handle}
                content={tweet.content}
                time={tweet.time}
                isFollowing={tweet.isFollowing}
                onFollowToggle={() => handleFollowToggle(index)} // Ajouté ici
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
