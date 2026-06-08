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
  const [dueDate, setDueDate] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [comments, setComments] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activities, setActivities] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [assignee, setAssignee] = useState("");
  const [members, setMembers] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useState<any[]>([]);
  const [type, setType] = useState("");

  const [component, setComponent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [previewUrl, setPreviewUrl] = useState("");

  const [fileType, setFileType] = useState("");

  const [tags, setTags] = useState("");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchIssue();
    // eslint-disable-next-line react-hooks/immutability
    fetchComments();
    // eslint-disable-next-line react-hooks/immutability
    fetchActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.on("activity-added", (activity) => {
      if (activity.issueId?._id === id) {
        setActivities((prev) => {
          const exists = prev.some((a) => a._id === activity._id);

          if (exists) return prev;

          return [activity, ...prev];
        });
      }
    });

    return () => {
      socket.off("activity-added");
    };
  }, [id]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);

    setFileType(file.type);

    setPreviewUrl(URL.createObjectURL(file));
  };
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
    if (!commentText.trim() && !selectedFile) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("issueId", id!);

      formData.append("text", commentText);

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      await api.post("/comments", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setCommentText("");

      setSelectedFile(null);

      setPreviewUrl("");

      setFileType("");

      await fetchComments();
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
    setAssignee(res.data.issue.assignee?._id || "");
    setType(res.data.issue.type);

    setComponent(res.data.issue.component);

    setTags(res.data.issue.tags?.join(",") || "");

    setDueDate(
      res.data.issue.dueDate
        ? new Date(res.data.issue.dueDate).toISOString().split("T")[0]
        : "",
    );

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
          dueDate,

          type,
          component,

          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      await fetchIssue();
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
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2"
        >
          <option>Bug</option>
          <option>Feature</option>
          <option>Task</option>
          <option>Improvement</option>
          <option>Hotfix</option>
        </select>
        <select
          value={component}
          onChange={(e) => setComponent(e.target.value)}
          className="border p-2"
        >
          <option>Frontend</option>
          <option>Backend</option>
          <option>API</option>
          <option>Database</option>
          <option>DevOps</option>
          <option>Mobile</option>
          <option>UI/UX</option>
          <option>Other</option>
        </select>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="border p-2 w-full"
          placeholder="login,payment"
        />
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
      <div className="mt-4">
        <label className="block mb-2">Due Date</label>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border p-2 w-full"
        />
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
      <div className="mt-2">
        Due Date:
        {issue.dueDate
          ? new Date(issue.dueDate).toLocaleDateString()
          : "Not Set"}
      </div>
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>

        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment._id} className="border rounded p-3">
              <div className="font-semibold">{comment.userId?.name}</div>

              {comment.attachment && (
                <>
                  {comment.attachment.mimeType?.startsWith("image/") && (
                    <img
                      src={`http://localhost:5000${comment.attachment.fileUrl}`}
                      alt=""
                      className="max-w-md rounded mb-2"
                    />
                  )}

                  {comment.attachment.mimeType?.startsWith("video/") && (
                    <video controls className="max-w-md rounded mb-2">
                      <source
                        src={`http://localhost:5000${comment.attachment.fileUrl}`}
                      />
                    </video>
                  )}

                  {comment.attachment.mimeType?.startsWith("audio/") && (
                    <audio controls className="mb-2">
                      <source
                        src={`http://localhost:5000${comment.attachment.fileUrl}`}
                      />
                    </audio>
                  )}

                  {!comment.attachment.mimeType?.startsWith("image/") &&
                    !comment.attachment.mimeType?.startsWith("video/") &&
                    !comment.attachment.mimeType?.startsWith("audio/") && (
                      <a
                        href={`http://localhost:5000${comment.attachment.fileUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline block mb-2"
                      >
                        📄 {comment.attachment.fileName}
                      </a>
                    )}
                </>
              )}

              {comment.text && <p>{comment.text}</p>}
            </div>
          ))}
        </div>

        <div className="mt-5 border rounded p-4">
          {selectedFile && (
            <div className="mb-3">
              {fileType.startsWith("image/") && (
                <img src={previewUrl} alt="" className="max-h-60 rounded" />
              )}

              {fileType.startsWith("video/") && (
                <video controls className="max-h-60 rounded">
                  <source src={previewUrl} />
                </video>
              )}

              {fileType.startsWith("audio/") && (
                <audio controls>
                  <source src={previewUrl} />
                </audio>
              )}

              {!fileType.startsWith("image/") &&
                !fileType.startsWith("video/") &&
                !fileType.startsWith("audio/") && (
                  <div className="p-3 bg-gray-100 rounded">
                    📄 {selectedFile.name}
                  </div>
                )}
            </div>
          )}

          <textarea
            className="border w-full p-3"
            rows={3}
            placeholder="Add comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />

          <div className="flex justify-between mt-3">
            <label className="cursor-pointer text-xl">
              📎
              <input type="file" hidden onChange={handleFileSelect} />
            </label>

            <button
              onClick={addComment}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Post
            </button>
          </div>
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
