// src/components/auth/RegisterForm.jsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { registerSchema } from '@/lib/schemas/authSchemas';
import { useRegister } from '@/hooks/queries/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function RegisterForm() {
    const router = useRouter();
    const { mutate: registerUser, isPending } = useRegister();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: { role: 'customer' },
    });

    const selectedRole = watch('role');

    const onSubmit = (formData) => {
        registerUser(formData, {
            onSuccess: () => {
                toast.success('Registered successfully. Please log in.');
                router.push('/login');
            },
            onError: (error) => {
                toast.error(error.response?.data?.message || 'Registration failed');
            },
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" {...register('username')} />
                {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
            </div>

            <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register('password')} />
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <div>
                <Label>Account Type</Label>
                <Select
                    defaultValue="customer"
                    onValueChange={(value) => setValue('role', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="seller">Seller</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {selectedRole === 'seller' && (
                <>
                    <div>
                        <Label htmlFor="storeName">Store Name</Label>
                        <Input id="storeName" {...register('storeName')} />
                        {errors.storeName && (
                            <p className="text-sm text-red-500">{errors.storeName.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="storeDescription">Store Description</Label>
                        <Input id="storeDescription" {...register('storeDescription')} />
                    </div>
                </>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Registering...' : 'Register'}
            </Button>
        </form>
    );
}