'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        setIsLoading(true);
        // TODO: Implement reset password logic
        setMessage('Password reset successfully!');
        setIsLoading(false);
    };

    return (
        <div className="container mx-auto py-12">
            <div className="mx-auto max-w-md">
                <h1 className="mb-6 text-2xl font-bold">Reset Password</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded border px-4 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full rounded border px-4 py-2"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
                {message && <p className="mt-4 text-green-600">{message}</p>}
                {token && <p className="mt-2 text-sm text-gray-500">Token: {token}</p>}
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="container mx-auto py-12">Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
