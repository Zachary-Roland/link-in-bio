import { lazy } from "react";
import { Navigate, type RouteObject } from "react-router";
import App from "./App";
import ProtectedRoute from "./components/ProtectedRoute";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Music = lazy(() => import("./pages/Music"));
const Projects = lazy(() => import("./pages/Projects"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminLinks = lazy(() => import("./pages/AdminLinks"));
const AdminShows = lazy(() => import("./pages/AdminShows"));

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "music", element: <Music /> },
      { path: "projects", element: <Projects /> },
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
