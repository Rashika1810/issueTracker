import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import ProtectedRoute from "./routes/ProtectedRoute";

import { AuthProvider } from "./context/AuthContext";
import CreateOrganization from "./pages/CreateOrganization";
import OrganizationDashboard from "./pages/OrganizationDashboard";
import { OrganizationProvider } from "./context/OrganizationContext";
import OrganizationRedirect from "./pages/OrganizationRedirect";
import CreateProject from "./pages/CreateProject";
import ProjectDetails from "./pages/ProjectDetails";
import Projects from "./pages/Projects";
import CreateIssue from "./pages/createIssue";
import IssueDetails from "./pages/IssueDetails";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OrganizationProvider>
          <Routes>
            <Route path="/" element={<Login />} />

            <Route path="/signup" element={<Signup />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <OrganizationRedirect />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-organization"
              element={
                <ProtectedRoute>
                  <CreateOrganization />
                </ProtectedRoute>
              }
            />

            <Route
              path="/organization"
              element={
                <ProtectedRoute>
                  <OrganizationDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              }
            />

            <Route
              path="/projects/create"
              element={
                <ProtectedRoute>
                  <CreateProject />
                </ProtectedRoute>
              }
            />

            <Route
              path="/projects/:id"
              element={
                <ProtectedRoute>
                  <ProjectDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:id/issues/create"
              element={
                <ProtectedRoute>
                  <CreateIssue />
                </ProtectedRoute>
              }
            />
            <Route
              path="/issues/:id"
              element={
                <ProtectedRoute>
                  <IssueDetails />
                </ProtectedRoute>
              }
            />
          </Routes>
        </OrganizationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
