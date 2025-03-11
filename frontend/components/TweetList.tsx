"use client";

import { useState } from "react";
import Tweet from "./Tweet";
import TweetModal from "./TweetModal";

interface TweetData {
    id: number;
    username: string;
    handle: string;
    content: string;
    time: string;
    isFollowing: boolean;
    onFollowToggle: () => void;
}

interface Comment {
    id_interaction: number;
    content: string;
    id_tweet: number;
    id_utilisateur: number;
    horodatage: string;
}

interface TweetsListProps {
    TweetList: TweetData[]; // Expecting an array of tweets as a prop
}

export default function TweetsList({ TweetList }: TweetsListProps) {
    const [selectedTweet, setSelectedTweet] = useState<TweetData | null>();
    const [comments, setComments] = useState<Comment[]>([]);

    const openTweet = async (tweet: TweetData) => {
        setSelectedTweet(tweet);

        try {
            const response = await fetch("/comments.json");
            const data = await response.json();

            console.log("Fetched comments data:", data);

            if (Array.isArray(data)) {
                const tweetComments = data.filter((comment) => comment.id_tweet === tweet.id);
                setComments(tweetComments);
            } else {
                //No comments for this tweet
                setComments([]);
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
            setComments([]); // Fallback in case of error
        }
    };

    return (
        <div>
            {TweetList.map((tweet) => (
                <div key={tweet.id} onClick={() => openTweet(tweet)}>
                    <Tweet key={tweet.id} {...tweet} />
                </div>
            ))}

            {/* Show modal if a tweet is selected */}
            {selectedTweet && (
                <TweetModal tweet={selectedTweet} comments={comments} onClose={() => setSelectedTweet(null)} />
            )}
        </div>
    );
}
