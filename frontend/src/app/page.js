import Link from 'next/link';
import ProductGrid from '@/components/products/ProductGrid';

const categories = ['Electronics', 'Fashion', 'Home', 'Beauty', 'Accessories'];

export default function HomePage() {
    return (
        <div>
            <section className="bg-linear-to-r from-slate-900 via-slate-800 to-slate-700 text-white">
                <div className="container mx-auto grid gap-10 px-4 py-20 md:grid-cols-2 md:items-center">
                    <div>
                        <p className="mb-4 text-sm font-medium tracking-[0.2em] text-blue-200 uppercase">
                            New season
                        </p>
                        <h1 className="text-4xl font-black tracking-tight md:text-6xl">
                            Upgrade your everyday essentials.
                        </h1>
                        <p className="mt-6 max-w-xl text-lg text-slate-200">
                            Discover premium products built for modern living,
                            with fast shipping and effortless shopping.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link
                                href="/products"
                                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                            >
                                Shop now
                            </Link>
                            <Link
                                href="/seller/dashboard"
                                className="inline-flex items-center justify-center rounded-md border border-white/50 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/20"
                            >
                                Become a seller
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-sm">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="rounded-2xl bg-white p-5 text-slate-900">
                                <p className="text-sm text-slate-500">
                                    Best seller
                                </p>
                                <h3 className="mt-2 text-xl font-bold">
                                    Aurora Headphones
                                </h3>
                                <p className="mt-2 text-2xl font-black">
                                    $149.99
                                </p>
                            </div>
                            <div className="rounded-2xl bg-blue-500/20 p-5">
                                <p className="text-sm text-blue-100">
                                    Weekend deals
                                </p>
                                <h3 className="mt-2 text-xl font-bold text-white">
                                    Up to 40% off
                                </h3>
                            </div>
                            <div className="col-span-2 rounded-2xl bg-linear-to-br from-white to-slate-200 p-6 text-slate-900">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm tracking-[0.2em] text-slate-500 uppercase">
                                        Featured
                                    </p>
                                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                        In stock
                                    </span>
                                </div>
                                <h3 className="mt-2 text-2xl font-bold">
                                    Minimal Desk Lamp
                                </h3>
                                <p className="mt-2 text-base text-slate-600">
                                    Clean design. Bright focus.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-4 py-12">
                <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-3xl font-bold">Popular categories</h2>
                    <Link
                        href="/products"
                        className="text-sm font-medium text-blue-600 hover:underline"
                    >
                        View all
                    </Link>
                </div>
                <div className="grid gap-4 md:grid-cols-5">
                    {categories.map((category) => (
                        <div
                            key={category}
                            className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm"
                        >
                            <p className="text-lg font-semibold">{category}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="container mx-auto px-4 pb-16">
                <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-3xl font-bold">Trending products</h2>
                    <Link
                        href="/products"
                        className="text-sm font-medium text-blue-600 hover:underline"
                    >
                        See more
                    </Link>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                    <ProductGrid />
                </div>
            </section>
        </div>
    );
}
