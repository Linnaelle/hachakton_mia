'use client';

import {useEffect, useState} from 'react';
import { useAppContext } from '../context/appContext';
import {useRouter} from "next/navigation";


export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const router = useRouter();
    const { appState, setUser, isLoading, setIsLoading } = useAppContext();

    useEffect(() => {
        if (appState.isLoggedIn) {
            router.push('/');
        }
    }, [appState.isLoggedIn, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Form validation
        if (!email || !password) {
            setErrorMessage('Please fill in both fields');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        try {
            // Make a POST request to the login endpoint
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle error response
                setErrorMessage(data.message || 'Login failed. Please try again.');
                return;
            }

            // Handle successful login using the AppContext
            if (data.user && data.tokens) {
                // Update the AppContext with user data and token
                setUser(data.user, data.tokens.accessToken);

                // No need to manually set localStorage as your AppContext already handles that
                // in the useEffect that runs when appState changes

                // Use the router for navigation instead of directly changing window.location
                // for better Next.js integration
                router.push('/');
            } else {
                setErrorMessage('Invalid response from server');
            }

        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('An error occurred during login. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 pt-22 flex items-center justify-center">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h1>

                {/* Error message */}
                {errorMessage && (
                    <div className="text-red-500 text-sm text-center mb-4">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-600">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-600">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                {/* Forgot Password Link */}
                <div className="mt-4 text-center">
                    <a href="#" className="text-sm text-blue-500 hover:underline">Forgot your password?</a>
                </div>

                {/* Login Link */}
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">Don't have an account yet? <a href="/signup" className="text-blue-500 hover:underline">Sign up here</a></p>
                </div>
            </div>
        </div>
    );
}