'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ProductForm({ isEdit = false }) {
    const [form, setForm] = useState({
        name: '',
        price: '',
        stock: '',
        category: '',
        description: '',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Product submit', form);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-lg border bg-white p-6 shadow-sm"
        >
            <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                        id="price"
                        name="price"
                        type="number"
                        value={form.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                        id="stock"
                        name="stock"
                        type="number"
                        value={form.stock}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={form.description}
                    onChange={handleChange}
                    className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm ring-0 outline-none"
                    required
                />
            </div>

            <Button type="submit" className="w-full">
                {isEdit ? 'Update Product' : 'Create Product'}
            </Button>
        </form>
    );
}
