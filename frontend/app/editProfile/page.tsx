'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function EditProfilePage() {
    const router = useRouter();

    // User Profile State
    const [profile, setProfile] = useState({
        username: 'Username',
        mail: 'mail@mail.com',
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
    function handleSave() {
        console.log('Profile updated:', profile);
        router.push('/profile'); // Redirect back to profile page
    }

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <div className="max-w-4xl mx-auto p-4">

                {/* Header */}
                <div className="relative bg-white p-6 rounded-lg shadow-md flex items-center">
                    <button onClick={() => router.push('/profile')} className="absolute left-4">
                        <ArrowLeftIcon className="w-6 h-6 text-gray-600 hover:text-gray-800 transition" />
                    </button>
                    <h1 className="text-xl font-bold mx-auto">Edit Profile</h1>
                </div>

                {/* Edit Form */}
                <div className="mt-4 bg-white p-6 rounded-lg shadow-md">

                    {/* Profile Picture Upload */}
                    <div className="flex flex-col items-center">
                        <label htmlFor="profilePic" className="cursor-pointer">
                            <img src={profile.profilePic} alt="Profile" className="w-24 h-24 rounded-full object-cover border" />
                        </label>
                        <input type="file" id="profilePic" className="hidden" onChange={handleProfilePicChange} />
                        <p className="text-sm text-gray-500 mt-2">Click to change profile picture</p>
                    </div>

                    {/* Form Fields */}
                    <div className="mt-6 space-y-4">
                        <div>
                            <label className="block text-gray-600 text-sm">Username</label>
                            <input type="text" name="username" value={profile.username} onChange={handleChange}
                                   className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 text-sm">Email</label>
                            <input type="text" name="handle" value={profile.mail} onChange={handleChange}
                                   className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 text-sm">Bio</label>
                            <textarea name="bio" value={profile.bio} onChange={handleChange} rows={3}
                                      className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                            />
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="mt-6 flex justify-end">
                        <button onClick={handleSave}
                                className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition">
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
