import { Suspense } from "react";
import { Outlet } from "react-router";
import Sidebar from "./components/Sidebar";
import MobileNav from "./components/MobileNav";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <MobileNav />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen">
                <span className="text-terminal-green-muted loading-dots">loading</span>
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
        <Footer />
      </div>
    </div>
  );
}
