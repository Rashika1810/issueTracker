import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Welcome {user?.name}
      </h1>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 mt-5"
      >
        Logout
      </button>
    </div>
  );
}