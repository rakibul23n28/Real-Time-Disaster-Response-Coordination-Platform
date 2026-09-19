import { useCallback, useEffect, useState } from "react";
import { apiClient, type ApiAllocation, type ApiInventory, type ApiIssue, type ApiResource, type ApiTask, type Incident, type Report } from "../lib/api";

export function useAdminData() {
  const [reports, setReports] = useState<Report[]>([]);
  const [tasks, setTasks] = useState<ApiTask[]>([]);
  const [issues, setIssues] = useState<ApiIssue[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [inventory, setInventory] = useState<ApiInventory[]>([]);
  const [resources, setResources] = useState<ApiResource[]>([]);
  const [allocations, setAllocations] = useState<ApiAllocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [nextReports, nextTasks, nextIssues, nextIncidents, nextInventory, nextResources, nextAllocations] = await Promise.all([
        apiClient.getReports(), apiClient.getTasks(), apiClient.getIssues(), apiClient.getIncidents(),
        apiClient.getInventory(), apiClient.getResources(), apiClient.getAllocations(),
      ]);
      setReports(nextReports);
      setTasks(nextTasks);
      setIssues(nextIssues);
      setIncidents(nextIncidents);
      setInventory(nextInventory);
      setResources(nextResources);
      setAllocations(nextAllocations);
    } catch (err) {
      setError(err instanceof Error ? err.message : "অ্যাডমিন তথ্য লোড করা যায়নি");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const updateReportStatus = useCallback(async (id: number, status: Report["status"]) => {
    const updated = await apiClient.updateReportStatus(id, status);
    setReports((current) => current.map((report) => report.id === id ? updated : report));
  }, []);

  const updateIssueStatus = useCallback(async (id: number, status: "reported" | "in_progress" | "resolved") => {
    const updated = await apiClient.updateIssueStatus(id, status);
    setIssues((current) => current.map((issue) => issue.id === id ? updated : issue));
  }, []);

  const adjustInventory = useCallback(async (item: ApiInventory, delta: number) => {
    const updated = await apiClient.updateInventory(item.id, { quantity: Math.max(0, item.quantity + delta) });
    setInventory((current) => current.map((entry) => entry.id === item.id ? updated : entry));
  }, []);

  const addInventory = useCallback(async (input: { resource_id: number; quantity: number; depot_name: string }) => {
    const created = await apiClient.createInventory(input);
    setInventory((current) => [...current, created]);
  }, []);

  const allocate = useCallback(async (input: { report_id?: number; resource_id: number; quantity: number }) => {
    const result = await apiClient.allocateResource(input);
    const [nextInventory, nextAllocations] = await Promise.all([apiClient.getInventory(), apiClient.getAllocations()]);
    setInventory(nextInventory);
    setAllocations((current) => [...current, ...nextAllocations.filter((item) => item.id === result.id)]);
  }, []);

  return {
    reports, tasks, issues, incidents, inventory, resources, allocations,
    loading, error, refresh, updateReportStatus, updateIssueStatus, adjustInventory, addInventory, allocate,
  };
}