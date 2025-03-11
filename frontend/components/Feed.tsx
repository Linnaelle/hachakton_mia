"use client";

import { useState, useEffect } from "react";
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

  // Chargement des tweets depuis un fichier JSON local
  useEffect(() => {
    fetch("/tweet.json")
      .then((response) => response.json())
      .then((data) => {
        setForYouTweets(data.forYou);
        setFollowingTweets(data.following);
      })
      .catch((error) => console.error("Erreur lors du chargement des tweets :", error));
  }, []);

  // Fonction pour gérer le toggle du bouton "Follow"
  const handleFollowToggle = (index: number) => {
    setForYouTweets((prevTweets) =>
      prevTweets.map((tweet, i) =>
        i === index ? { ...tweet, isFollowing: !tweet.isFollowing } : tweet
      )
    );
  };

  return (
    <div className="flex justify-center w-full">
      <div className="max-w-[600px] w-full">
        <Tabs setActiveTab={setActiveTab} activeTab={activeTab} />

        <div className="divide-y divide-gray-200">
          {(activeTab === "following" ? followingTweets : forYouTweets).map((tweet, index) => (
            <Tweet
              key={index}
              username={tweet.username}
              handle={tweet.handle}
              content={tweet.content}
              time={tweet.time}
              isFollowing={tweet.isFollowing}
              onFollowToggle={() => handleFollowToggle(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
