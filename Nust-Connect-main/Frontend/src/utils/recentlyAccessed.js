// Utility to manage recently accessed modules in localStorage

const MAX_RECENT = 4;
const STORAGE_KEY = 'recentlyAccessed';

export const addToRecent = (moduleName, path, icon) => {
    const recent = getRecent();

    // Remove if already exists to avoid duplicates
    const filtered = recent.filter(item => item.path !== path);

    // Add to beginning
    const updated = [
        {
            name: moduleName,
            path,
            icon,
            timestamp: new Date().toISOString(),
        },
        ...filtered,
    ].slice(0, MAX_RECENT); // Keep only MAX_RECENT items

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
};

export const getRecent = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error reading recently accessed:', error);
        return [];
    }
};

export const clearRecent = () => {
    localStorage.removeItem(STORAGE_KEY);
};

export const getTimeSince = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    return 'Just now';
};