import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-full bg-[#F4FBF6] flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="size-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg className="size-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-[#17221D] mb-2">দুঃখিত, একটি সমস্যা হয়েছে।</h1>
            <p className="text-[#66736D] text-sm mb-6">অ্যাপ্লিকেশনে একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।</p>
            <button
              onClick={() => { this.setState({ hasError: false }); window.location.href = "/"; }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2E7D5B] text-white font-semibold rounded-[9px] hover:bg-[#185C43] transition-colors text-sm"
            >
              ড্যাশবোর্ডে ফিরে যান
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
