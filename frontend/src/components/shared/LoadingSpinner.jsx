export default function LoadingSpinner({ label = 'Loading...' }) {
    return (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-gray-500">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            {label}
        </div>
    );
}
