import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { formatDistanceToNow } from "date-fns";
import { formatActivity } from "../utils/CommentUtils";

export default function IssueDetails() {
  const { id } = useParams();

  const [issue, setIssue] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useState<any>(null);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [comments, setComments] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activities, setActivities] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchIssue();
    // eslint-disable-next-line react-hooks/immutability
    fetchComments();
    // eslint-disable-next-line react-hooks/immutability
    fetchActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const fetchActivity = async () => {
    const token = localStorage.getItem("token");

    const res = await api.get(`/activity/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setActivities(res.data.logs);
  };
  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(`/comments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setComments(res.data.comments);
    } catch (error) {
      console.log(error);
    }
  };
  const addComment = async () => {
    if (!commentText.trim()) return;

    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/comments",
        {
          issueId: id,
          text: commentText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCommentText("");

      await fetchComments();
      await fetchActivity();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchIssue = async () => {
    const token = localStorage.getItem("token");

    const res = await api.get(`/issues/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setIssue(res.data.issue);
    setStatus(res.data.issue.status);

    setPriority(res.data.issue.priority);
  };

  if (!issue) {
    return <div>Loading...</div>;
  }
  const updateIssue = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/issues/${id}`,
        {
          status,
          priority,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      await fetchIssue();
      await fetchActivity();
      alert("Issue updated");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="p-10 max-w-4xl">
      <h1 className="text-3xl font-bold">{issue.title}</h1>

      <p className="mt-4">{issue.description}</p>

      <div className="mt-6 flex gap-4">
        <span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2"
          >
            <option>Todo</option>
            <option>In Progress</option>
            <option>Testing</option>
            <option>Done</option>
            <option>Blocked</option>
          </select>
        </span>

        <span>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border p-2"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>
        </span>
      </div>
      <button
        onClick={updateIssue}
        className="bg-black text-white px-4 py-2 rounded mt-5"
      >
        Save Changes
      </button>
      <div className="mt-4">
        Reporter:
        {issue.reporter?.name}
      </div>

      <div className="mt-2">
        Assignee:
        {issue.assignee?.name || "Unassigned"}
      </div>
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>

        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment._id} className="border rounded p-3">
              <div className="font-semibold">{comment.userId?.name}</div>

              <p className="mt-1">{comment.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <textarea
            className="border w-full p-3"
            rows={3}
            placeholder="Add comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />

          <button
            onClick={addComment}
            className="bg-black text-white px-4 py-2 mt-3 rounded"
          >
            Add Comment
          </button>
        </div>
      </div>
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Activity</h2>

        {activities.map((log) => (
          <div className="border-l-2 pl-4 py-3">
            <div>
              <strong>{log.userId?.name}</strong> {formatActivity(log)}
            </div>

            <div className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(log.createdAt), {
                addSuffix: true,
              })}
              {" • "}
              {new Date(log.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
