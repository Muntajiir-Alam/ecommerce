'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

const categories = [
    'All',
    'Electronics',
    'Fashion',
    'Home',
    'Beauty',
    'Accessories',
];

export default function ProductFilters() {
    const [selectedCategory, setSelectedCategory] = useState('All');

    return (
        <div className="rounded-lg border bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Filters</h2>

            <div className="space-y-4">
                <div>
                    <h3 className="mb-2 text-sm font-medium tracking-wide text-gray-500 uppercase">
                        Category
                    </h3>
                    <div className="space-y-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                type="button"
                                onClick={() => setSelectedCategory(category)}
                                className={`block w-full rounded-md px-3 py-2 text-left text-sm ${
                                    selectedCategory === category
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="mb-2 text-sm font-medium tracking-wide text-gray-500 uppercase">
                        Price
                    </h3>
                    <input type="range" min="0" max="500" className="w-full" />
                </div>

                <Button className="w-full">Apply Filters</Button>
            </div>
        </div>
    );
}
