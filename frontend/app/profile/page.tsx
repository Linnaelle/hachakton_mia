'use client';

import { useState } from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import TweetsList from "@/components/TweetList";
import {gql, useQuery} from "@apollo/client";
import { useAppContext } from '../context/appContext';


const GET_USER_INFO = gql`
  query GetTweets {
    userTimeline {
      user
      tweets
      comments
      likedTweets
      bookmarks
    }
  }
`;

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('posts');
    const { appState } = useAppContext();

    // Récupération des tweets
    const { data, loading, error } = useQuery(GET_USER_INFO, {
        fetchPolicy: "cache-and-network", // Évite d'afficher des données obsolètes
        context: {
            headers: {
                Authorization: `Bearer ${appState?.token}`,
            }
        }
    });
    if (data) { console.log(data)}

    function handleFollow() {
        //Why would you want to follow yourself ?
    }

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 pt-22">
            <div className="max-w-4xl mx-auto p-4">
                {/* Profile Header */}
                <div className="relative bg-white p-6 rounded-lg shadow-md">
                    {/* Edit Profile Button in Top-Right Corner */}
                    <Link href="/editProfile">
                        <button className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition">
                            <PencilIcon className="w-6 h-6 text-gray-600" />
                        </button>
                    </Link>

                    {/* Profile Info */}
                    <div className="flex items-center space-x-6">
                        <img src="/placeholder-profile.jpg" alt="Profile" className="w-20 h-20 rounded-full" />
                        <div>
                            <h1 className="text-xl font-bold">Username</h1>
                            <p className="text-gray-600">This is a sample bio.</p>
                            <div className="mt-2 flex space-x-4 text-sm text-gray-500">
                                <span><strong>100</strong> Posts</span>
                                <span><strong>200</strong> Followers</span>
                                <span><strong>500</strong> Following</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-4 flex space-x-4 border-b">
                    {['posts', 'comments', 'liked'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-2 px-4 ${activeTab === tab ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Message d'erreur en cas de problème */}
                {error && (
                    <div className="bg-red-500 text-white p-2 rounded mb-2">
                        {error.message}
                    </div>
                )}
                {/* Tab Content */}
                <div className="mt-4 bg-white p-4 rounded-lg shadow-sm">
                    {activeTab === 'posts' && (
                        <div>
                            <TweetsList tweets={data?.userTimeline || []} loading={loading} />
                        </div>
                    )}
                    {activeTab === 'liked' && <div>Liked posts here...</div>}
                    {activeTab === 'comments' && <div>Comments here...</div>}
                </div>
            </div>
        </div>
    );
}
