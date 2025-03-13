/**
 * Composant de suggestions de profils à suivre
 * Affiche une liste de profils suggérés que l'utilisateur pourrait vouloir suivre
 */
"use client";

import { useState } from "react";

/**
 * Interface définissant la structure d'un profil suggéré
 * @interface Profile
 */
interface Profile {
  username: string;
  handle: string;
  avatar: string;
  isFollowing: boolean;
}

/**
 * Données initiales de profils suggérés (mock data)
 */
const initialProfiles: Profile[] = [
  {
    username: "ShawFCB",
    handle: "@fcb_shaw",
    avatar: "/avatars/shaw.jpg", // À remplacer par de vraies URLs
    isFollowing: false,
  },
  {
    username: "studiocyen.bsky.social",
    handle: "@studiocyen",
    avatar: "/avatars/studiocyen.jpg",
    isFollowing: false,
  },
  {
    username: "Darkheim® ✖️⚜️🍿",
    handle: "@d4rkheim",
    avatar: "/avatars/darkheim.jpg",
    isFollowing: false,
  },
];

/**
 * Composant qui affiche les profils suggérés avec possibilité de les suivre
 * @returns {JSX.Element} - Composant rendu
 */
export default function SuggestedProfiles() {
  // État local pour gérer la liste des profils et leurs statuts
  const [profiles, setProfiles] = useState(initialProfiles);

  /**
   * Gère l'action de suivre/ne plus suivre un profil
   * @param {number} index - Index du profil dans le tableau
   */
  const handleFollowToggle = (index: number) => {
    setProfiles((prevProfiles) =>
        prevProfiles.map((profile, i) =>
            // Inverse l'état isFollowing uniquement pour le profil concerné
            i === index ? { ...profile, isFollowing: !profile.isFollowing } : profile
        )
    );
  };

  return (
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="font-bold text-gray-900 text-lg mb-3">Who to follow</h2>
        
        {/* Liste des profils suggérés */}
        {profiles.map((profile, index) => (
            <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg transition">
              {/* Informations du profil */}
              <div className="flex items-center gap-4">
                <img src={profile.avatar} alt={profile.username} className="w-12 h-12 rounded-full object-cover border border-gray-300" />
                <div>
                  <p className="text-gray-900 font-semibold">{profile.username}</p>
                  <p className="text-gray-500 text-sm">{profile.handle}</p>
                </div>
              </div>
              
              {/* Bouton pour suivre/ne plus suivre */}
              <button
                  onClick={() => handleFollowToggle(index)}
                  className={`px-5 py-2 text-sm font-medium rounded-full transition-all border border-gray-300 shadow-sm ${
                      profile.isFollowing ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-900 hover:bg-gray-200"
                  }`}
              >
                {profile.isFollowing ? "Following" : "Follow"}
              </button>
            </div>
        ))}
        
        {/* Lien pour voir plus de suggestions */}
        <p className="text-blue-600 text-sm mt-3 cursor-pointer hover:underline">Show more</p>
      </div>
  );
}