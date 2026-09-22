'use client';

export default function ProfilePage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="mb-8 text-3xl font-bold">My Profile</h1>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="rounded border bg-white p-6">
                    <h2 className="mb-4 text-xl font-bold">
                        Personal Information
                    </h2>
                    {/* Profile form */}
                </div>
                <div className="rounded border bg-white p-6">
                    <h2 className="mb-4 text-xl font-bold">Addresses</h2>
                    {/* Address management */}
                </div>
            </div>
        </div>
    );
}
