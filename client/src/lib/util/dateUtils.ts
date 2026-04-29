export function formatBulgarianDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('bg-BG', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
}

export function formatBulgarianDateOnly(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('bg-BG', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}