import { Suspense } from "react";
import { Outlet } from "react-router";

export default function App() {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar will be added in Task 4 */}
      <main className="flex-1">
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
