import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    // Update state so next render shows fallback UI
    return { hasError: true, errorMessage: error.toString() };
  }

  componentDidCatch(error, info) {
    // You can also log error to an error reporting service here
    console.error("Error caught by Error Boundary:", error);
    console.error("Component Stack:", info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="bg-white p-8 rounded shadow-md text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong.</h2>
            <p className="mb-4 text-gray-700">{this.state.errorMessage}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;