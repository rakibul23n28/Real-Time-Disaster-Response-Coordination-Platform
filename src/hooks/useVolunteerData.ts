import { useCallback, useEffect, useState } from "react";
import { apiClient, type ApiIssue, type ApiNotification, type ApiTask } from "../lib/api";
import { issueTypeConfig, type FieldIssue } from "../data/issueTypes";
import type { Task, TaskStatus } from "../data/taskTypes";

function formatDate(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleString("bn-BD", { dateStyle: "medium", timeStyle: "short" });
}

function mapTask(task: ApiTask): Task {
  return {
    id: task.task_code,
    backendId: task.id,
    reportId: task.report_id ? String(task.report_id) : "",
    title: task.title,
    description: task.description,
    instructions: task.instructions ?? "",
    location: {
      name: task.location_name ?? "অজানা স্থান",
      district: task.district ?? "",
      lat: Number(task.loc_lat ?? 23.685),
      lng: Number(task.loc_lng ?? 90.356),
    },
    priority: task.priority,
    status: task.status,
    assignedTo: "",
    assignedVolunteers: task.assignments?.map((assignment) => String(assignment.volunteer_id)) ?? [],
    assignedAt: formatDate(task.assigned_at ?? ""),
    resources: [],
    affectedPeople: 0,
  };
}

function mapIssue(issue: ApiIssue): FieldIssue {
  const config = issueTypeConfig[issue.issue_type];
  return {
    id: issue.issue_code,
    taskId: issue.task_id ? String(issue.task_id) : "",
    type: issue.issue_type,
    label: config.label,
    icon: config.icon,
    location: {
      name: issue.location_name ?? "অজানা স্থান",
      lat: Number(issue.latitude ?? 23.685),
      lng: Number(issue.longitude ?? 90.356),
    },
    description: issue.description,
    status: issue.status === "in_progress" ? "acknowledged" : issue.status,
    createdAt: issue.created_at,
    displayTime: formatDate(issue.created_at),
  };
}

export function useVolunteerData() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [issues, setIssues] = useState<FieldIssue[]>([]);
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [apiTasks, apiIssues, apiNotifications] = await Promise.all([
        apiClient.getTasks(),
        apiClient.getIssues(),
        apiClient.getNotifications(),
      ]);
      setTasks(apiTasks.map(mapTask));
      setIssues(apiIssues.map(mapIssue));
      setNotifications(apiNotifications);
    } catch (err) {
      setError(err instanceof Error ? err.message : "তথ্য লোড করা যায়নি");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const updateTaskStatus = useCallback(async (task: Task, status: TaskStatus) => {
    if (!task.backendId) throw new Error("কাজটির সার্ভার আইডি পাওয়া যায়নি");
    const updated = await apiClient.updateTaskStatus(task.backendId, status);
    setTasks((current) => current.map((item) => item.id === task.id ? mapTask(updated) : item));
  }, []);

  const addIssue = useCallback(async (input: Parameters<typeof apiClient.createIssue>[0]) => {
    const created = await apiClient.createIssue(input);
    const mapped = mapIssue(created);
    setIssues((current) => [mapped, ...current]);
    return mapped;
  }, []);

  const markNotificationsRead = useCallback(async () => {
    await apiClient.markNotificationsRead();
    setNotifications((current) => current.map((notification) => ({ ...notification, is_read: 1 })));
  }, []);

  return { tasks, issues, notifications, loading, error, refresh, updateTaskStatus, addIssue, markNotificationsRead };
}