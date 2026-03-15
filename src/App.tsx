import { Suspense } from "react";
import { Outlet } from "react-router";
import Sidebar from "./components/Sidebar";

export default function App() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <span className="text-terminal-green-muted">loading...</span>
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
