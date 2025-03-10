'use client';

import { useState } from 'react';

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('posts');

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 pt-22">
            <div className="max-w-4xl mx-auto p-4">
                {/* Profile Header */}
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-6">
                    <img src="/placeholder-profile.jpg" alt="Profile" className="w-20 h-20 rounded-full" />
                    <div>
                        <h1 className="text-xl font-bold">Username</h1>
                        <p className="text-gray-600">This is a sample bio.</p>
                        <div className="mt-2 flex space-x-4 text-sm text-gray-500">
                            <span><strong>100</strong> Posts</span>
                            <span><strong>200</strong> Comments</span>
                            <span><strong>500</strong> Liked</span>
                            <span><strong>200</strong> Saved</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-4 flex space-x-4 border-b">
                    {['posts', 'comments', 'liked', 'saved'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-2 px-4 ${activeTab === tab ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="mt-4 bg-white p-4 rounded-lg shadow-sm">
                    {activeTab === 'posts' && <div>Post content here...</div>}
                    {activeTab === 'liked' && <div>Liked posts here...</div>}
                    {activeTab === 'comments' && <div>Comments here...</div>}
                    {activeTab === 'saved' && <div>Saved here...</div>}
                </div>
            </div>
        </div>
    );
}