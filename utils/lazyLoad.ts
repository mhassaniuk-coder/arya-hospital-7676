import { lazy, ComponentType } from 'react';

/**
 * A wrapper around React.lazy that automatically refreshes the page
 * if a chunk fails to load (e.g., due to a new deployment).
 */
export const lazyWithRetry = <T extends ComponentType<any>>(
    factory: () => Promise<{ default: T }>
) => {
    return lazy(async () => {
        try {
            return await factory();
        } catch (error: any) {
            const pageHasAlreadyBeenForceRefreshed = JSON.parse(
                window.sessionStorage.getItem('page-has-been-force-refreshed') || 'false'
            );

            // Check if the error is a chunk load error
            if (error.message && (
                error.message.includes('Failed to fetch dynamically imported module') ||
                error.message.includes('Importing a module script failed') ||
                error.name === 'ChunkLoadError'
            )) {
                if (!pageHasAlreadyBeenForceRefreshed) {
                    // Mark that we are forcing a refresh
                    window.sessionStorage.setItem('page-has-been-force-refreshed', 'true');
                    // Reload the page to get the new index.html and chunks
                    window.location.reload();
                    // Return a never-resolving promise to prevent the error boundary from showing immediately
                    return new Promise(() => { });
                }
            }

            // If it's another error or we already retried, throw it
            throw error;
        }
    });
};
