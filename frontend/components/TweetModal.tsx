"use client";

import {
    HeartIcon,
    ChatBubbleOvalLeftIcon,
    ArrowPathIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";
import { useRef } from "react";

interface TweetData {
    id: number;
    username: string;
    handle: string;
    content: string;
    time: string;
    isFollowing: boolean;
}

interface Comment {
    id_interaction: number;
    content: string;
    id_tweet: number;
    id_utilisateur: number;
    horodatage: string;
}

interface TweetModalProps {
    tweet: TweetData;
    comments: Comment[];
    onClose: () => void;
}

export default function TweetModal({ tweet, comments, onClose }: TweetModalProps) {
    return (
        <div
            className="fixed inset-0 bg-black/60 flex justify-center items-start overflow-y-auto pt-22"
            onClick={onClose} // Detect clicks on the background
        >
            {/* Modal Content */}
            <div
                className="bg-white w-full max-w-2xl rounded-xl shadow-lg mt-10 relative p-6"
                onClick={(e) => e.stopPropagation()} // Prevent background click from closing modal
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 left-3 text-gray-500 hover:text-gray-700 transition"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>

                {/* Tweet Content */}
                <div className="border-b pb-4">
                    <div className="flex gap-3">
                        <img
                            src="/next.svg"
                            alt="Profile"
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="font-bold">{tweet.username}</span>
                                <span className="text-gray-500">{tweet.handle}</span>
                                <span className="text-gray-500">· {tweet.time}</span>
                            </div>
                            <p className="mt-2 text-lg">{tweet.content}</p>
                        </div>
                    </div>
                </div>

                {/* Tweet Actions */}
                <div className="flex justify-around py-3 border-b text-gray-500">
                    <button className="flex items-center gap-2 hover:text-blue-500">
                        <ChatBubbleOvalLeftIcon className="w-5 h-5" />
                        <span>Reply</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-green-500">
                        <ArrowPathIcon className="w-5 h-5" />
                        <span>Retweet</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-red-500">
                        <HeartIcon className="w-5 h-5" />
                        <span>Like</span>
                    </button>
                </div>

                {/* Comments Section */}
                <div className="space-y-4 pt-4">
                    <h4 className="font-semibold text-lg">Comments</h4>
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <div key={comment.id_interaction} className="p-3 border rounded-lg">
                                <p className="text-gray-700">{comment.content}</p>
                                <span className="text-gray-500 text-xs">{comment.horodatage}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No comments yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
