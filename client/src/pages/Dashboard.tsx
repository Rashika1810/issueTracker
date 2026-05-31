import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <button
        className="bg-black text-white px-4 py-2 mt-5"
        onClick={() =>
          navigate("/create-organization")
        }
      >
        Create Organization
      </button>
    </div>
  );
}