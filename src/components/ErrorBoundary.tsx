import React, { Component, ReactNode } from "react";
import * as Sentry from "@sentry/react";
import { FaExclamationTriangle } from "react-icons/fa";

// Typage des props et de l'état
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Envoi de l'erreur à Sentry
    Sentry.captureException(error);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen p-5 text-center">
          <div className="flex justify-center">
            <FaExclamationTriangle className="text-red-500 text-2xl mb-2" />
          </div>
          <h2 className="text-red-500">
            Une erreur est survenue dans l'application
          </h2>
          <details className="whitespace-pre-wrap text-left max-w-full break-words">
            <summary className="cursor-pointer mb-2">Voir les détails</summary>
            <pre className="bg-white p-2 rounded overflow-x-auto">
              {this.state.error?.toString()}
            </pre>
            <pre className="bg-white p-2 rounded overflow-x-auto">
              {this.state.errorInfo?.componentStack}
            </pre>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
