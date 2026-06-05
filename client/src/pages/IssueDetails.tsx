import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { formatDistanceToNow } from "date-fns";
import { formatActivity } from "../utils/CommentUtils";
import { socket } from "../socket";

export default function IssueDetails() {
  const { id } = useParams();
  const [issue, setIssue] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useState<any>(null);
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [comments, setComments] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activities, setActivities] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [assignee, setAssignee] = useState("");
  const [members, setMembers] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useState<any[]>([]);
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
  const fetchMembers = async (projectId: string) => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(`/projects/${projectId}/members`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMembers(res.data.members);
    } catch (error) {
      console.log(error);
    }
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

    const issueData = res.data.issue;

    setIssue(issueData);
    setStatus(issueData.status);
    setPriority(issueData.priority);
    setAssignee(issueData.assignee?._id || "");

    // Fetch project members here
    await fetchMembers(issueData.projectId);
  };
  useEffect(() => {
    if (issue?.projectId) {
      socket.emit("join-project-room", issue.projectId);
    }
  }, [issue]);

  useEffect(() => {
    socket.on("comment-added", (comment) => {
      setComments((prev) => {
        const exists = prev.some((c) => c._id === comment._id);

        if (exists) {
          return prev;
        }

        return [...prev, comment];
      });
    });

    return () => {
      socket.off("comment-added");
    };
  }, []);

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
          assignee,
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
  const deleteIssue = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this issue?",
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/issues/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Issue deleted");

      navigate(-1);
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
      <div className="mt-4">
        <label className="block mb-2">Assignee</label>

        <select
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="" disabled>
            Unassigned
          </option>

          {members.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (member: any) => (
              <option key={member._id} value={member._id}>
                {member.name}
              </option>
            ),
          )}
        </select>
      </div>
      <button
        onClick={updateIssue}
        className="bg-black text-white px-4 py-2 rounded mt-5"
      >
        Save Changes
      </button>
      <button
        onClick={deleteIssue}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Delete Issue
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
