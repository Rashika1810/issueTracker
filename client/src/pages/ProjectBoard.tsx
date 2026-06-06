import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import api from "../api/axios";
import { socket } from "../socket";
import { isOverdue } from "../utils/dateUtils";

const STATUSES = ["Todo", "In Progress", "Testing", "Done", "Blocked"];

export default function ProjectBoard() {
  const { id } = useParams();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [issues, setIssues] = useState<any[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchIssues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (id) {
      socket.emit("join-project-room", id);
    }
  }, [id]);
  useEffect(() => {
    socket.on("issue-updated", (updatedIssue) => {
      setIssues((prev) =>
        prev.map((issue) =>
          issue._id === updatedIssue._id
            ? {
                ...issue,
                ...updatedIssue,
              }
            : issue,
        ),
      );
    });

    return () => {
      socket.off("issue-updated");
    };
  }, []);

  const fetchIssues = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(`/issues/project/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIssues(res.data.issues);
    } catch (error) {
      console.log(error);
    }
  };

  const updateIssueStatus = async (issueId: string, status: string) => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/issues/${issueId}`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      console.log(error);
    }
  };

  const onDragEnd = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result: any,
  ) => {
    const { destination, draggableId } = result;

    if (!destination) return;

    const newStatus = destination.droppableId;

    setIssues((prev) =>
      prev.map((issue) =>
        issue._id === draggableId
          ? {
              ...issue,
              status: newStatus,
            }
          : issue,
      ),
    );

    await updateIssueStatus(draggableId, newStatus);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Kanban Board</h1>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-5 gap-4">
          {STATUSES.map((status) => {
            const columnIssues = issues.filter(
              (issue) => issue.status === status,
            );

            return (
              <Droppable key={status} droppableId={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-gray-100 rounded-lg p-3 min-h-125"
                  >
                    <h2 className="font-bold mb-4">{status}</h2>

                    {columnIssues.map((issue, index) => (
                      <Draggable
                        key={issue._id}
                        draggableId={issue._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 rounded border mb-3 shadow-sm ${
                              issue.status !== "Done" &&
                              isOverdue(issue.dueDate)
                                ? "bg-red-50 border-red-500"
                                : "bg-white"
                            }`}
                          >
                            <h3 className="font-medium">{issue.title}</h3>

                            <p className="text-sm text-gray-500 mt-1">
                              {issue.priority}
                              <p className="text-xs text-gray-500 mt-1">
                                Due:
                                {issue.dueDate
                                  ? new Date(issue.dueDate).toLocaleDateString()
                                  : "-"}
                              </p>
                            </p>
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
