export default function Pagination({
    currentPage = 1,
    totalPages = 1,
    onPageChange,
}) {
    return (
        <div className="mt-8 flex items-center justify-center gap-2">
            <button
                type="button"
                onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
            >
                Prev
            </button>
            <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
            </span>
            <button
                type="button"
                onClick={() =>
                    onPageChange?.(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
}
