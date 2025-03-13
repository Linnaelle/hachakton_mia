"use client";

import { useState } from "react";

interface Profile {
  username: string;
  handle: string;
  avatar: string;
  isFollowing: boolean;
}

const initialProfiles: Profile[] = [
  {
    username: "ShawFCB",
    handle: "@fcb_shaw",
    avatar: "/avatars/shaw.jpg", // Remplace avec une vraie URL
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

export default function SuggestedProfiles() {
  const [profiles, setProfiles] = useState(initialProfiles);

  const handleFollowToggle = (index: number) => {
    setProfiles((prevProfiles) =>
        prevProfiles.map((profile, i) =>
            i === index ? { ...profile, isFollowing: !profile.isFollowing } : profile
        )
    );
  };

  return (
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="font-bold text-gray-900 text-lg mb-3">Who to follow</h2>
        {profiles.map((profile, index) => (
            <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg transition">
              <div className="flex items-center gap-4">
                <img src={profile.avatar} alt={profile.username} className="w-12 h-12 rounded-full object-cover border border-gray-300" />
                <div>
                  <p className="text-gray-900 font-semibold">{profile.username}</p>
                  <p className="text-gray-500 text-sm">{profile.handle}</p>
                </div>
              </div>
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
        <p className="text-blue-600 text-sm mt-3 cursor-pointer hover:underline">Show more</p>
      </div>
  );
}