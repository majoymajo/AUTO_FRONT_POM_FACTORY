import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';


interface Props {
  children: ReactNode;
  fallback: ReactNode | ((error: Error, resetError: () => void) => ReactNode);
  onCatch?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Standard React Error Boundary (Class Component)
 * Catches JavaScript errors anywhere in their child component tree.
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    if (this.props.onCatch) {
      this.props.onCatch(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error, this.resetError);
      }
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
