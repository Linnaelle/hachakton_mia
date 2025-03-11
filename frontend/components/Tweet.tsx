"use client";

import { HeartIcon, ChatBubbleOvalLeftIcon, ArrowPathIcon, UserPlusIcon, CheckIcon } from '@heroicons/react/24/outline';

interface TweetProps {
  username: string;
  handle: string;
  content: string;
  time: string;
  isFollowing: boolean;
  onFollowToggle: () => void;
}

const handleButtonClick = (e: React.MouseEvent, callback: () => void) => {
  e.stopPropagation(); // Prevent the tweet click event
  callback(); // Trigger the specific button's action
};

const onLikeClicked = () => {
  console.log("Liekd")
}

export default function Tweet({ username, handle, content, time, isFollowing, onFollowToggle }: TweetProps) {
  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex gap-3">
        <img
          src="/next.svg"
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover"
        />

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold">{username}</span>
              <span className="text-gray-500">{handle}</span>
              <span className="text-gray-500">· {time}</span>
            </div>

            <button
              onClick={(e) => handleButtonClick(e, onFollowToggle)}
              className={`flex items-center gap-1 px-3 py-1 text-sm font-medium ${isFollowing ? 'bg-blue-500 text-white' : 'bg-black text-white'} rounded-full hover:bg-gray-800`}
            >
              {isFollowing ? <CheckIcon className="w-4 h-4" /> : <UserPlusIcon className="w-4 h-4" />}
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>

          <p className="mt-2">{content}</p>

          <div className="flex gap-8 mt-4 text-gray-500">
            <button className="flex items-center gap-2 hover:text-blue-500"onClick={(e) => handleButtonClick(e, onLikeClicked)}>
              <ChatBubbleOvalLeftIcon className="w-5 h-5" />
              <span>1.2K</span>
            </button>
            <button className="flex items-center gap-2 hover:text-green-500" onClick={(e) => handleButtonClick(e, onLikeClicked)}>
              <ArrowPathIcon className="w-5 h-5" />
              <span>892</span>
            </button>
            <button className="flex items-center gap-2 hover:text-red-500"onClick={(e) => handleButtonClick(e, onLikeClicked)}>
              <HeartIcon className="w-5 h-5" />
              <span>15.6K</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
