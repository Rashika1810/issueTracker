import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import ProtectedRoute from "./routes/ProtectedRoute";

import { AuthProvider } from "./context/AuthContext";
import CreateOrganization from "./pages/CreateOrganization";
import OrganizationDashboard from "./pages/OrganizationDashboard";
import { OrganizationProvider } from "./context/OrganizationContext";
import OrganizationRedirect from "./pages/OrganizationRedirect";

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
          </Routes>
        </OrganizationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
