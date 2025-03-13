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

import { FOLLOW_MUTATION } from "../app/graphql/mutations"
// import { useMutation } from "@apollo/client"
import { useQueryClient } from "@tanstack/react-query"
import { useMutation } from "@apollo/client"
import { useAppContext } from "@/app/context/appContext"
 
interface TweetProps {
  id: string
  content: string
  isLiked: boolean
  createdAt: string
  likes: number
  isFollowing: boolean
  retweets: number
  isRetweet: boolean
  isRetweeted: boolean
  comments: [string]
  author: {
    id: string;
    username: string
  },
  profile_img: string // Ajout de l'image de profil dynamique
  onFollowToggle: () => void
  handleFollowToggle: (userId: string) => void
}
 
const handleButtonClick = (e: React.MouseEvent, callback: () => void) => {
  e.stopPropagation(); // Empêche la propagation pour éviter l'ouverture accidentelle du tweet
  callback();
};
 
export default function Tweet({
   id, content, createdAt, isFollowing, profile_img, author, isLiked, likes,
   retweets, isRetweeted, comments, onFollowToggle, handleFollowToggle 
  }: TweetProps) {
  const [liked, setLiked] = useState(isLiked);
  const [retweeted, setRetweeted] = useState(isRetweeted);
  const [likesCount, setLikesCount] = useState(likes);
  const [retweetsCount, setRetweetsCount] = useState(retweets);
  const [following, setFollowing] = useState(isFollowing)
  const { appState } = useAppContext();
 
  const [followUser, { loading }] = useMutation(FOLLOW_MUTATION)


  const handleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation();
  
    try {
      const { data } = await followUser({
        variables: { userId: author.id },
      });

      // // Si la mutation réussit, on récupère la nouvelle valeur de isFollowing
      // const newFollowingState = data?.followUser?.isFollowing;  
      console.log(data)
      const newFollowingState = data?.followUser?.isFollowing; // État retourné par l'API
      handleFollowToggle(author.id, newFollowingState); // Met à jour globalement

    } catch (error) {
      console.error("Erreur lors du suivi de l'utilisateur:", error);
    }
};
 
  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };
 
  const handleRetweet = () => {
    setRetweeted(!retweeted);
    setRetweetsCount(retweeted ? retweetsCount - 1 : retweetsCount + 1);
  };

  // const handleFollow = (e: React.MouseEvent) => {
  //   handleButtonClick(e, () => followMutation.mutate());
  // };
 
  return (
  <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
    <div className="flex gap-3">
      <img
        src={profile_img}
        alt={`${author.username}'s profile`}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold">{author.username}</span>
          <span className="text-gray-500">@{author.username}</span>
          <span className="text-gray-500">· {createdAt}</span>
      </div>
      {/* follow button */}
      {!(appState?.user?.id === author.id) &&(
      <button
        // onClick={(e) => handleButtonClick(e, onFollowToggle)}
        onClick={handleFollow}
        disabled={loading}
        className={`flex items-center gap-1 px-3 py-1 text-sm font-medium 
          ${isFollowing ? "bg-blue-500 text-white" : "bg-black text-white"} 
          rounded-full hover:bg-gray-800 transition`} >
          {isFollowing ? <CheckIcon className="w-4 h-4" /> : <UserPlusIcon className="w-4 h-4" />}
          {isFollowing ? "Following" : "Follow"}
      </button>)}
    </div>
    
    <p className="mt-2">{content}</p>
    <div className="flex gap-8 mt-4 text-gray-500">
      {/* comment icon button */}
      <button className="flex items-center gap-2 hover:text-blue-500">
        <ChatBubbleOvalLeftIcon className="w-5 h-5" />
        <span>{comments?comments.length:0}</span> {/* Ex: 1,200 */}
      </button>
      {/* retweet button */}
      <button 
          className={`flex items-center gap-2 ${isRetweeted ? "text-blue-500" : "hover:text-blue-500"}`}
          onClick={(e) => handleButtonClick(e, handleRetweet)}
        >
        {retweeted ? <ArrowPathSolid className="w-5 h-5" /> : <ArrowPathIcon className="w-5 h-5" />}
        <span>{retweets}</span>
      </button>
      {/* like unlike */}
      <button 
        className={`flex items-center gap-2 ${isLiked ? "text-red-500" : "hover:text-red-500"}`}
        onClick={(e) => handleButtonClick(e, handleLike)}
      >
        {isLiked ? <HeartSolid className="w-5 h-5" /> : <HeartOutline className="w-5 h-5" />}
        <span>{likes}</span>
      </button>
    </div>
    </div>
    </div>
  </div>
  );
}