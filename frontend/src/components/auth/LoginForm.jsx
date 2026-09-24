// src/components/auth/LoginForm.jsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { loginSchema } from '@/lib/schemas/authSchemas';
import { useLogin } from '@/hooks/queries/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginForm() {
    const router = useRouter();
    const { mutate: login, isPending } = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (formData) => {
        login(formData, {
            onSuccess: () => {
                toast.success('Logged in successfully');
                router.push('/');
            },
            onError: (error) => {
                toast.error(error.response?.data?.message || 'Login failed');
            },
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Label htmlFor="username">Username or Email</Label>
                <Input id="username" {...register('username')} />
                {errors.username && (
                    <p className="text-sm text-red-500">{errors.username.message}</p>
                )}
            </div>

            <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register('password')} />
                {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Logging in...' : 'Login'}
            </Button>
        </form>
    );
}