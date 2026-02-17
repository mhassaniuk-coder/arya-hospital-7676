import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        this.setState({ errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-red-50 text-red-900 font-sans">
                    <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
                    <p className="mb-4">The application crashed. Please report this error:</p>
                    <div className="bg-white p-6 rounded-lg shadow-xl border border-red-200 max-w-3xl w-full overflow-auto">
                        <h2 className="text-xl font-mono font-bold text-red-700 mb-2">
                            {this.state.error?.toString()}
                        </h2>
                        <details className="whitespace-pre-wrap text-sm text-slate-600 font-mono">
                            <summary className="cursor-pointer mb-2 font-semibold hover:text-red-600">Stack Trace</summary>
                            {this.state.errorInfo?.componentStack}
                        </details>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-8 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Reload Application
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
