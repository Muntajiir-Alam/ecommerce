'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // TODO: Implement forgot password logic
        setMessage('Check your email for password reset link');
        setIsLoading(false);
    };

    return (
        <div className="container mx-auto py-12">
            <div className="mx-auto max-w-md">
                <h1 className="mb-6 text-2xl font-bold">Forgot Password</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded border px-4 py-2"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
                {message && <p className="mt-4 text-green-600">{message}</p>}
                <p className="mt-4 text-center text-sm">
                    <Link
                        href="/login"
                        className="text-blue-600 hover:underline"
                    >
                        Back to Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
