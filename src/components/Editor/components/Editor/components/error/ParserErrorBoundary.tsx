import React from 'react';

export class ParserErrorBoundary extends React.Component {
    state = {hasError: false};

    constructor(props: {}) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(error: Error | unknown) {
        // Update state so the next render will show the fallback UI.
        return {
            hasError: true,
        };
    }

    componentDidCatch(error: Error | unknown, errorInfo: unknown) {
        // You can also log the error to an error reporting service
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <h1>Error</h1>;
        }

        return this.props.children;
    }
}