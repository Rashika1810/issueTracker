// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatActivity = (log: any) => {
  switch (log.action) {
    case "ISSUE_CREATED":
      return "created the issue";

    case "COMMENT_ADDED":
      return "added a comment";

    case "STATUS_CHANGED":
      return `changed status from ${log.metadata.from} to ${log.metadata.to}`;

    case "PRIORITY_CHANGED":
      return `changed priority from ${log.metadata.from} to ${log.metadata.to}`;

    default:
      return log.action;
  }
};