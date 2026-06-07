import { useEffect, useState } from "react";

import api from "../api/axios";
import { formatActivity } from "../utils/CommentUtils";

export default function DashboardAnalytics() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stats, setStats] = useState<any>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activities, setActivities] = useState<any[]>([]);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(res.data.stats);

      setActivities(res.data.recentActivity);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboard();
  }, []);

  if (!stats) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">Dashboard Analytics</h1>

      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Projects" value={stats.projects} />

        <StatCard title="Issues" value={stats.totalIssues} />

        <StatCard title="Open" value={stats.open} />

        <StatCard title="In Progress" value={stats.inProgress} />

        <StatCard title="Testing" value={stats.testing} />

        <StatCard title="Done" value={stats.done} />

        <StatCard title="Overdue" value={stats.overdue} />
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>

        {activities.map((activity) => (
          <div key={activity._id} className="border-b py-3">
            <strong>{activity.userId?.name}</strong> {formatActivity(activity)}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="border rounded p-4 shadow">
      <div className="text-gray-500">{title}</div>

      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}
