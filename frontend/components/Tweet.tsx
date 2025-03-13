/**
 * Composant Tweet
 * Affiche un tweet individuel avec ses interactions (like, retweet, commentaire)
 */
"use client";
 
import { useState } from "react";
import { 
  HeartIcon as HeartOutline, 
  ChatBubbleOvalLeftIcon, 
  ArrowPathIcon, 
  UserPlusIcon, 
  CheckIcon 
} from "@heroicons/react/24/outline";
 
import { 
  HeartIcon as HeartSolid, 
  ArrowPathIcon as ArrowPathSolid 
} from "@heroicons/react/24/solid";

import { FOLLOW_MUTATION, LIKE_TWEET, RE_TWEET } from "../app/graphql/mutations"
import { useMutation } from "@apollo/client"
import { useAppContext } from "@/app/context/appContext"
 
/**
 * Interface définissant les propriétés d'un tweet
 * @interface TweetProps
 */
interface TweetProps {
  id: string                // Identifiant unique du tweet
  content: string           // Contenu textuel du tweet
  isLiked: boolean          // Si le tweet est liké par l'utilisateur courant
  createdAt: string         // Date de création au format string
  likes: number             // Nombre de likes
  isFollowing: boolean      // Si l'auteur est suivi par l'utilisateur courant
  retweets: number          // Nombre de retweets
  isRetweet: boolean        // Si ce tweet est un retweet
  isRetweeted: boolean      // Si ce tweet a été retweeté par l'utilisateur courant
  comments: [string]        // Liste des commentaires (IDs)
  author: {                 // Informations sur l'auteur
    profile_img: string | undefined;
    id: string;
    username: string
  },
  profile_img: string       // Image de profil pour affichage
  onFollowToggle: () => void // Fonction appelée lors du suivi/désuivi
  handleFollowToggle: (userId: string) => void // Fonction pour gérer le suivi/désuivi
}
 
/**
 * Composant d'affichage d'un tweet
 * @param {TweetProps} props - Propriétés du tweet
 * @returns {JSX.Element} - Composant rendu
 */
export default function Tweet({
   id, content, createdAt, isFollowing, author, isLiked, likes,
   retweets, isRetweeted, comments
  }: TweetProps) {
  // États locaux pour gérer les interactions
  const [liked, setLiked] = useState(isLiked)
  const [retweeted, setRetweeted] = useState(isRetweeted)
  const [likesCount, setLikesCount] = useState(likes)
  const [retweetsCount, setRetweetsCount] = useState(retweets)
  const [following, setFollowing] = useState(isFollowing)
  
  // Contexte global de l'application
  const { appState } = useAppContext()

  /**
   * Mutation GraphQL pour liker/unliker un tweet
   * Met à jour le cache Apollo après la mutation
   */
  const [likeTweet] = useMutation(LIKE_TWEET, {
    variables: { tweetId: id },
    update(cache, { data: { likeTweet } }) {
      cache.modify({
        id: cache.identify({ __typename: "Tweet", id }),
        fields: {
          likes(existingLikes = 0) {
            return likeTweet.liked ? existingLikes + 1 : existingLikes - 1;
          },
          liked() {
            return likeTweet.liked;
          },
        },
      });
    },
  });

  /**
   * Mutation GraphQL pour retweeter/annuler un retweet
   * Met à jour le cache Apollo après la mutation
   */
  const [reTweet] = useMutation(RE_TWEET, {
    variables: { tweetId: id },
    update(cache, { data: { reTweet } }) {
      cache.modify({
        id: cache.identify({ __typename: "Tweet", id }),
        fields: {
          retweets(existingRetweets = 0) {
            return reTweet.success ? existingRetweets + 1 : existingRetweets - 1;
          },
          isRetweeted() {
            return reTweet.success;
          },
        },
      });
    },
  });

  /**
   * Mutation GraphQL pour suivre/ne plus suivre un utilisateur
   */
  const [followUser, { loading }] = useMutation(FOLLOW_MUTATION)

  /**
   * Gère l'action de suivre/ne plus suivre l'auteur du tweet
   * @param {React.MouseEvent} e - Événement de clic
   */
  const handleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation();  // Empêche la propagation de l'événement
  
    try {
        // Exécution de la mutation GraphQL
        const { data } = await followUser({
            variables: { userId: author.id },
        });

        console.log(data);
        // Mise à jour de l'état de suivi local
        const newFollowingState = data?.followUser?.isFollowing ?? !following;
        
        setFollowing(newFollowingState);
        // Rafraîchissement de la page pour actualiser les données
        window.location.reload();
    } catch (error) {
        console.error("Erreur lors du suivi de l'utilisateur:", error);
    }
  };

  /**
   * Gère l'action de liker/unliker un tweet
   * @param {React.MouseEvent} e - Événement de clic
   */
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();  // Empêche la propagation de l'événement

    try {
      // Exécution de la mutation GraphQL
      const { data } = await likeTweet();
      if (data?.likeTweet?.success) {
        // Mise à jour des états locaux
        setLiked(data.likeTweet.liked);
        setLikesCount(data.likeTweet.likes);
      }
    } catch (error) {
      console.error("Erreur lors du like:", error);
    }
  }
 
  /**
   * Gère l'action de retweeter/annuler un retweet
   * @param {React.MouseEvent} e - Événement de clic
   */
  const handleRetweet = async (e: React.MouseEvent) => {
    e.stopPropagation();  // Empêche la propagation de l'événement

    try {
      // Exécution de la mutation GraphQL
      const { data } = await reTweet();
      if (data?.reTweet?.success) {
        console.log(data);
        // Mise à jour des états locaux
        setRetweeted(!retweeted);
        setRetweetsCount(retweeted ? retweetsCount - 1 : retweetsCount + 1);
      }
    } catch (error) {
      console.error("Erreur lors du retweet:", error);
    }
  };

  // Rendu du composant
  return (
  <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
    <div className="flex gap-3">
      {/* Image de profil de l'auteur */}
      <img
        src={author.profile_img}
        alt={`${author.username}'s profile`}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex-1">
        {/* En-tête du tweet avec les informations de l'auteur */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold">{author.username}</span>
            <span className="text-gray-500">@{author.username}</span>
            <span className="text-gray-500">· {createdAt}</span>
          </div>
          
          {/* Bouton de suivi (non affiché pour ses propres tweets) */}
          {!(appState?.user?.id === author.id) && (
            <button
              onClick={handleFollow}
              disabled={loading}
              className={`flex items-center gap-1 px-3 py-1 text-sm font-medium 
                ${following ? "bg-blue-500 text-white" : "bg-black text-white"} 
                rounded-full hover:bg-gray-800 transition`}
            >
              {following ? <CheckIcon className="w-4 h-4" /> : <UserPlusIcon className="w-4 h-4" />}
              {following ? "Following" : "Follow"}
            </button>
          )}
        </div>
      
        {/* Contenu du tweet */}
        <p className="mt-2">{content}</p>
        
        {/* Barre d'actions du tweet */}
        <div className="flex gap-8 mt-4 text-gray-500">
          {/* Bouton de commentaire */}
          <button className="flex items-center gap-2 hover:text-blue-500">
            <ChatBubbleOvalLeftIcon className="w-5 h-5" />
            <span>{comments ? comments.length : 0}</span>
          </button>
          
          {/* Bouton de retweet */}
          <button 
            className={`flex items-center gap-2 ${retweeted ? "text-blue-500" : "hover:text-blue-500"}`}
            onClick={(e) => handleRetweet(e)}
          >
            {retweeted ? <ArrowPathSolid className="w-5 h-5" /> : <ArrowPathIcon className="w-5 h-5" />}
            <span>{retweetsCount}</span>
          </button>
          
          {/* Bouton de like */}
          <button 
            className={`flex items-center gap-2 ${liked ? "text-red-500" : "hover:text-red-500"}`}
            onClick={(e) => handleLike(e)}
          >
            {liked ? <HeartSolid className="w-5 h-5" /> : <HeartOutline className="w-5 h-5" />}
            <span>{likesCount}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  );
}