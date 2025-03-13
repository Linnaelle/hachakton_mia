"use client";

import { useState } from "react"
import { useQuery, useMutation, gql } from "@apollo/client"
import { Image, FileImage, Smile, BarChart, MapPin, Camera } from "lucide-react"
import TweetsList from "./TweetList"
import Tabs from "./Tabs"

// GraphQL Query pour récupérer les tweets
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
        id
        username
      }
    }
  }
`;

// GraphQL Mutation pour poster un tweet
const POST_TWEET = gql`
  mutation PostTweet($content: String!) {
    createTweet(content: $content) {
      _id
      content
      createdAt
      author {
        username
        handle
      }
    }
  }
`;

export default function Feed() {
  const [activeTab, setActiveTab] = useState<"forYou" | "following">("forYou");
  const [newTweet, setNewTweet] = useState("");
  
  // Récupération des tweets
  const { data, loading, error } = useQuery(GET_TWEETS, {
    fetchPolicy: "cache-and-network", // Évite d'afficher des données obsolètes
  });
  if (data) { console.log(data)}

  // Mutation pour poster un tweet
  const [postTweet, { loading: postingTweet }] = useMutation(POST_TWEET, {
    update(cache, { data: { createTweet } }) {
      cache.modify({
        fields: {
          getTimeline(existingTweets = []) {
            return [createTweet, ...existingTweets];
          },
        },
      });
    },
    onError: (err) => console.error("Erreur lors de l'envoi du tweet :", err),
  });

  // Fonction pour envoyer un tweet via GraphQL
  const handlePostTweet = async () => {
    if (!newTweet.trim()) return;

    try {
      await postTweet({
        variables: { content: newTweet },
      });
      setNewTweet(""); // Réinitialise le champ après envoi
    } catch (error) {
      console.error("Erreur lors de l'envoi du tweet :", error);
    }
  };

  return (
    <div className="flex justify-center w-full">
      <div className="max-w-[600px] w-full">
        <Tabs setActiveTab={setActiveTab} activeTab={activeTab} />

        {/* Message d'erreur en cas de problème */}
        {error && (
          <div className="bg-red-500 text-white p-2 rounded mb-2">
            {error.message}
          </div>
        )}

        {/* Formulaire de création de tweet */}
        <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg shadow-md mb-4 text-white">
          <textarea
            className="w-full p-2 border border-gray-600 rounded bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500"
            placeholder="What's happening?"
            value={newTweet}
            onChange={(e) => setNewTweet(e.target.value)}
            disabled={postingTweet} // Désactive si envoi en cours
            style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          />

          {/* Boutons fictifs */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex space-x-3 text-blue-400">
              <button className="hover:text-blue-300">
                <Image size={20} />
              </button>
              <button className="hover:text-blue-300">
                <FileImage size={20} />
              </button>
              <button className="hover:text-blue-300">
                <BarChart size={20} />
              </button>
              <button className="hover:text-blue-300">
                <Smile size={20} />
              </button>
              <button className="hover:text-blue-300">
                <Camera size={20} />
              </button>
              <button className="hover:text-blue-300">
                <MapPin size={20} />
              </button>
            </div>

            <button
              className={`px-4 py-2 rounded text-white ${
                newTweet.trim()
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-500 cursor-not-allowed"
              }`}
              onClick={handlePostTweet}
              disabled={!newTweet.trim() || postingTweet}
            >
              {postingTweet ? "Posting..." : "Post"}
            </button>
          </div>
        </div>

        {/* Affichage des tweets via TweetsList */}
        <TweetsList tweets={data?.getTimeline || []} loading={loading} />
      </div>
    </div>
  );
}
