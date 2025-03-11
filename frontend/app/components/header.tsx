'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState({isLoggedIn: true, profilePic: '/placeholder-profile.jpg'});

    function logOut() {
        setUser({isLoggedIn: false, profilePic: '/placeholder-profile.jpg'});
        setMenuOpen(false);
    }

    return (
        <header className="bg-white shadow-md p-6 flex justify-between items-center fixed top-0 w-full z-50 border-b">
            {/* Title */}
            <Link href="/" className="text-2xl font-bold text-blue-600">Rettewt</Link>

            {/* Search Bar */}
            <div className="flex-grow mx-4 max-w-lg">
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full p-3 bg-gray-50 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
                {user.isLoggedIn ? (
                    <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center space-x-3">
                        <img src={user.profilePic} alt="Profile" className="w-12 h-12 rounded-full border-2 border-gray-300 shadow-md" />
                    </button>
                ) : (
                    <div className="flex space-x-4">
                        <Link href="/login" className="text-blue-300 font-semibold">Log In</Link>
                        <Link href="/signup" className=" text-blue-600 font-semibold">Sign Up</Link>
                    </div>
                )}

                {menuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                        <Link href="/profile" className="block px-4 py-2 text-black hover:bg-gray-100">Profile</Link>
                        <button className="block w-full text-left text-black px-4 py-2 hover:bg-gray-100 hover:cursor-pointer" onClick={() => logOut()}>Logout</button>
                    </div>
                )}
            </div>
        </header>
    );
}
