import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container text-center mt-5 pt-5">
          <h2 className="fw-bold text-danger">Something went wrong.</h2>
          <p className="text-muted">Please refresh the page or try again later.</p>
          <button className="btn btn-primary-custom mt-3" onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;