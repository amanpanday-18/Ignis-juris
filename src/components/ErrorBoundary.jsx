import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
                    <h1>Application Error</h1>
                    <p>Something went wrong rendering the application.</p>
                    <pre style={{ color: 'red', textAlign: 'left', background: '#f8f8f8', padding: '10px', overflowX: 'auto' }}>
                        {this.state.error && this.state.error.toString()}
                    </pre>
                    <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
