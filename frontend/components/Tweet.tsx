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
 
interface TweetProps {
  id: string,
  content: string;
  isLiked: boolean;
  createdAt: string;
  likes: number;
  isFollowing: boolean;
  retweets: number;
  isRetweet: boolean;
  isRetweeted: boolean;
  comments: [string];
  author: {
    id: string;
    username: string;
  },
  profile_img: string; // Ajout de l'image de profil dynamique
  onFollowToggle: () => void;
}
 
const handleButtonClick = (e: React.MouseEvent, callback: () => void) => {
  e.stopPropagation(); // Empêche la propagation pour éviter l'ouverture accidentelle du tweet
  callback();
};
 
export default function Tweet({ id, content, createdAt, isFollowing, profile_img, author, isLiked, likes, retweets, isRetweeted, comments, onFollowToggle }: TweetProps) {
  const [liked, setLiked] = useState(false);
  const [retweeted, setRetweeted] = useState(false);
  const [likesCount, setLikesCount] = useState(15600);
  const [retweetsCount, setRetweetsCount] = useState(892);
 
  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };
 
  const handleRetweet = () => {
    setRetweeted(!retweeted);
    setRetweetsCount(retweeted ? retweetsCount - 1 : retweetsCount + 1);
  };
 
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
      <button
        onClick={(e) => handleButtonClick(e, onFollowToggle)}
        className={`flex items-center gap-1 px-3 py-1 text-sm font-medium 
          ${isFollowing ? "bg-blue-500 text-white" : "bg-black text-white"} 
          rounded-full hover:bg-gray-800 transition`} >
          {isFollowing ? <CheckIcon className="w-4 h-4" /> : <UserPlusIcon className="w-4 h-4" />}
          {isFollowing ? "Following" : "Follow"}
      </button>
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