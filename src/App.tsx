import { Component, Suspense, type ReactNode } from "react";
import { Outlet, ScrollRestoration } from "react-router";
import Sidebar from "./components/Sidebar";
import MobileNav from "./components/MobileNav";
import Footer from "./components/Footer";

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    const isChunkError = error.message.includes("dynamically imported module");
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-terminal-bg text-terminal-green font-mono px-4">
        <div className="w-full max-w-md space-y-4">
          <p className="text-terminal-green-muted text-xs">zacharyroland.dev ~ %</p>
          {isChunkError ? (
            <>
              <p><span className="text-terminal-green-muted">error:</span> site updated — cached version is stale</p>
              <p className="text-terminal-green-muted text-sm">run <span className="text-terminal-green">reload</span> to fix</p>
            </>
          ) : (
            <>
              <p><span className="text-terminal-green-muted">error:</span> something went wrong</p>
              <p className="text-terminal-green-muted text-sm">{error.message}</p>
            </>
          )}
          <button
            onClick={() => window.location.reload()}
            className="border border-terminal-green px-4 py-1 text-sm hover:bg-terminal-green hover:text-terminal-bg transition-colors"
          >
            reload
          </button>
        </div>
      </div>
    );
  }
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <ScrollRestoration />
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <MobileNav />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <ErrorBoundary>
            <Suspense
              fallback={<div className="fixed inset-0 z-[9998] bg-terminal-bg" />}
            >
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </div>
  );
}
