import { lazy } from "react";
import { Navigate, useRouteError, type RouteObject } from "react-router";
import App from "./App";
import ProtectedRoute from "./components/ProtectedRoute";

function RootError() {
  const error = useRouteError() as Error;
  const isChunkError = error?.message?.includes("dynamically imported module");
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-terminal-bg text-terminal-green font-mono px-4">
      <div className="w-full max-w-md space-y-4">
        <p className="text-terminal-green-muted text-xs">zacharyroland.dev ~ %</p>
        {isChunkError ? (
          <>
            <p><span className="text-terminal-green-muted">error:</span> site updated — cached version is stale</p>
            <p className="text-terminal-green-muted text-sm">run <span className="text-terminal-green">reload</span> to fix</p>
            <button
              onClick={() => window.location.reload()}
              className="border border-terminal-green px-4 py-1 text-sm hover:bg-terminal-green hover:text-terminal-bg transition-colors"
            >
              reload
            </button>
          </>
        ) : (
          <>
            <p><span className="text-terminal-green-muted">error:</span> something went wrong</p>
            <p className="text-terminal-green-muted text-sm">{error?.message ?? "unknown error"}</p>
            <button
              onClick={() => window.location.reload()}
              className="border border-terminal-green px-4 py-1 text-sm hover:bg-terminal-green hover:text-terminal-bg transition-colors"
            >
              reload
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Music = lazy(() => import("./pages/Music"));
const Projects = lazy(() => import("./pages/Projects"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminLinks = lazy(() => import("./pages/AdminLinks"));
const AdminShows = lazy(() => import("./pages/AdminShows"));
const Contact = lazy(() => import("./pages/Contact"));

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    errorElement: <RootError />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "music", element: <Music /> },
      { path: "projects", element: <Projects /> },
      { path: "contact", element: <Contact /> },
      { path: "admin/login", element: <AdminLogin /> },
      {
        path: "admin",
        element: (
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="links" replace /> },
          { path: "links", element: <AdminLinks /> },
          { path: "shows", element: <AdminShows /> },
        ],
      },
    ],
  },
];
