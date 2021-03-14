const isDev = false;
import React from 'react';
export function ErrorFallback({error, resetErrorBoundary}: { error: Error, resetErrorBoundary: () => void }) {
    if (!isDev) return null;
    return (
        <div role="alert" style={{color: 'white'}}>
            <p>Something went wrong:</p>
            <pre style={{padding: 3, margin: 0}}>{error.message}</pre>
            <button onClick={resetErrorBoundary}>Try again</button>
        </div>
    )
}