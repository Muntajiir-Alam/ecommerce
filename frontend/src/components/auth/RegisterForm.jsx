'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RegisterForm() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Register payload', form);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-lg border bg-white p-6 shadow-sm"
        >
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
            </div>

            <Button type="submit" className="w-full">
                Create Account
            </Button>

            <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                    href="/login"
                    className="font-medium text-blue-600 hover:underline"
                >
                    Login here
                </Link>
            </p>
        </form>
    );
}
