'use client';

import { useState } from 'react';
import { useProducts } from '@/hooks/queries/useProducts';
import { useCategories } from '@/hooks/queries/useCategories';
import ProductGrid from '@/components/products/ProductGrid';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function ProductsPage() {
    const [categoryFilter, setCategoryFilter] = useState('all');

    const { data: categories } = useCategories();
    const { data: products, isLoading, error } = useProducts(
        categoryFilter !== 'all' ? { category: categoryFilter } : {}
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Products</h1>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All categories</SelectItem>
                        {categories?.map((cat) => (
                            <SelectItem key={cat._id} value={cat._id}>
                                {cat.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {isLoading && <p>Loading products...</p>}
            {error && <p className="text-red-500">Failed to load products</p>}
            {products && <ProductGrid products={products.products} />}
        </div>
    );
}