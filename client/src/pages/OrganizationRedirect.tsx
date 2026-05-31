import { Navigate } from "react-router-dom";

import { useOrganization } from "../context/OrganizationContext";

export default function OrganizationRedirect() {
  const { organization, loading } = useOrganization();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }
console.log("REDIRECT LOADING:", loading);
console.log("REDIRECT ORG:", organization);
  if (organization) {
    return <Navigate to="/organization" replace />;
  }

  return <Navigate to="/create-organization" replace />;
}
