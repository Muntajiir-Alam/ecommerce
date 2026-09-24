// src/lib/schemas/authSchemas.js
import { z } from 'zod';

export const loginSchema = z.object({
    username: z.string().min(1, 'Username or email is required'),
    password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
    .object({
        name: z.string().min(1, 'Name is required'),
        email: z.string().email('Invalid email address'),
        username: z
            .string()
            .min(3, 'Username must be at least 3 characters')
            .max(15),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        role: z.enum(['customer', 'seller']).default('customer'),
        storeName: z.string().optional(),
        storeDescription: z.string().optional(),
    })
    .refine(
        (data) => {
            if (data.role === 'seller') {
                return !!data.storeName;
            }
            return true;
        },
        {
            message: 'Store name is required for seller registration',
            path: ['storeName'],
        }
    );
