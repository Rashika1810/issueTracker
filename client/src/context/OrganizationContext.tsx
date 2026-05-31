import { createContext, useContext, useEffect, useState } from "react";

import api from "../api/axios";

interface Organization {
  _id: string;
  name: string;
  members: string[];
}

interface OrganizationContextType {
  organization: Organization | null;
  loading: boolean;
  fetchOrganization: () => Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const OrganizationContext = createContext<OrganizationContextType>(
  {} as OrganizationContextType,
);

export const OrganizationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [organization, setOrganization] = useState<Organization | null>(null);

  const [loading, setLoading] = useState(true);

  const fetchOrganization = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const res = await api.get("/organizations/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrganization(res.data.organization);
    } catch {
      setOrganization(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrganization();
  }, []);

  return (
    <OrganizationContext.Provider
      value={{
        organization,
        loading,
        fetchOrganization,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useOrganization = () => useContext(OrganizationContext);
