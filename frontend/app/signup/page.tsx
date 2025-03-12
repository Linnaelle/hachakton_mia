'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function EditProfilePage() {
    const router = useRouter();

    // User Profile State
    const [profile, setProfile] = useState({
        username: 'Username',
        email: 'mail@mail.com',
        bio: 'This is a sample bio.',
        profilePic: '/placeholder-profile.jpg',
    });

    // Handle Input Changes
    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    }

    // Handle Profile Picture Upload
    function handleProfilePicChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfile((prev) => ({ ...prev, profilePic: imageUrl }));
        }
    }

    // Handle Save (Mock Function)
    function handleSave(e: React.FormEvent) {
        e.preventDefault();
        console.log('Profile updated:', profile);
        router.push('/profile'); // Redirect back to profile page
    }

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 flex items-center justify-center">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">

                {/* Header */}
                <div className="relative flex items-center justify-center mb-6">
                    <button onClick={() => router.push('/profile')} className="absolute left-0">
                        <ArrowLeftIcon className="w-6 h-6 text-gray-600 hover:text-gray-800 transition" />
                    </button>
                    <h1 className="text-2xl font-bold text-center text-gray-800">Edit Profile</h1>
                </div>

                {/* Profile Form */}
                <form onSubmit={handleSave}>

                    {/* Profile Picture */}
                    <div className="flex flex-col items-center mb-6">
                        <label htmlFor="profilePic" className="cursor-pointer">
                            <img src={profile.profilePic} alt="Profile" className="w-24 h-24 rounded-full object-cover border" />
                        </label>
                        <input type="file" id="profilePic" className="hidden" onChange={handleProfilePicChange} />
                        <p className="text-sm text-gray-500 mt-2">Click to change profile picture</p>
                    </div>

                    {/* Username Input */}
                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={profile.username}
                            onChange={handleChange}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Email Input */}
                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={profile.email}
                            onChange={handleChange}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Bio Input */}
                    <div className="mb-6">
                        <label className="block text-gray-600 text-sm">Bio</label>
                        <textarea
                            name="bio"
                            value={profile.bio}
                            onChange={handleChange}
                            rows={3}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Save Button */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}
