import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { mockReports, type Report } from "../data/mockReports";
import { mockTasks, type Task, type TaskStatus } from "../data/mockTasks";
import { mockIssues, type FieldIssue } from "../data/mockIssues";
import { mockNotifications as initialNotifications } from "../data/mockIncidents";
import { mockInventory, type InventoryItem } from "../data/mockInventory";
import { mockResourceRequests, type ResourceRequest } from "../data/mockResourceRequests";

interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
  type: string;
  link?: string;
}

interface AppStateContextType {
  reports: Report[];
  tasks: Task[];
  issues: FieldIssue[];
  notifications: Notification[];
  inventory: InventoryItem[];
  resourceRequests: ResourceRequest[];
  addReport: (r: Report) => void;
  updateReportStatus: (id: string, status: "verified" | "rejected" | "pending") => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  updateIssueStatus: (id: string, status: "reported" | "acknowledged" | "resolved") => void;
  addIssue: (issue: FieldIssue) => void;
  addNotification: (msg: string, type: string, link?: string) => void;
  markNotificationsRead: () => void;
  allocateResources: (requestId: string, allocations: { category: string; quantity: number }[]) => void;
  adjustInventory: (id: string, delta: number) => void;
  addInventoryItem: (item: InventoryItem) => void;
  resetDemoData: () => void;
}

const AppStateContext = createContext<AppStateContextType | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [issues, setIssues] = useState<FieldIssue[]>(mockIssues);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [resourceRequests, setResourceRequests] = useState<ResourceRequest[]>(mockResourceRequests);

  const addReport = useCallback((r: Report) => {
    setReports((prev) => [r, ...prev]);
    setNotifications((prev) => [
      { id: `N${Date.now()}`, message: `নতুন রিপোর্ট ${r.id} যাচাইয়ের অপেক্ষায় — ${r.location.name}`, time: "এইমাত্র", read: false, type: "report", link: `/admin/reports/${r.id}` },
      ...prev,
    ]);
  }, []);

  const updateReportStatus = useCallback((id: string, status: "verified" | "rejected" | "pending") => {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    const statusMsg = status === "verified" ? "যাচাইকৃত" : status === "rejected" ? "বাতিল" : "অপেক্ষমাণ";
    setNotifications((prev) => [
      { id: `N${Date.now()}`, message: `রিপোর্ট ${id} "${statusMsg}" হয়েছে`, time: "এইমাত্র", read: false, type: "report", link: `/admin/reports/${id}` },
      ...prev,
    ]);
  }, []);

  const updateTaskStatus = useCallback((id: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    const statusLabels: Record<TaskStatus, string> = {
      assigned: "বরাদ্দকৃত",
      en_route: "পথে রয়েছে",
      in_progress: "চলমান",
      completed: "সম্পন্ন",
    };
    setNotifications((prev) => [
      { id: `N${Date.now()}`, message: `কাজ ${id} এর অবস্থা "${statusLabels[status]}" হয়েছে`, time: "এইমাত্র", read: false, type: "task", link: `/volunteer/tasks/${id}` },
      ...prev,
    ]);
  }, []);

  const updateIssueStatus = useCallback((id: string, status: "reported" | "acknowledged" | "resolved") => {
    setIssues((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    const statusMsg = status === "resolved" ? "সমাধান হয়েছে" : status === "acknowledged" ? "দেখা হয়েছে" : "জানানো হয়েছে";
    setNotifications((prev) => [
      { id: `N${Date.now()}`, message: `মাঠ সমস্যা ${id} "${statusMsg}"`, time: "এইমাত্র", read: false, type: "alert", link: `/admin/operations` },
      ...prev,
    ]);
  }, []);

  const addIssue = useCallback((issue: FieldIssue) => {
    setIssues((prev) => [issue, ...prev]);
    setNotifications((prev) => [
      { id: `N${Date.now()}`, message: `মাঠপর্যায়ে নতুন সমস্যা: ${issue.label} — ${issue.location.name}`, time: "এইমাত্র", read: false, type: "alert", link: `/admin/operations` },
      ...prev,
    ]);
  }, []);

  const addNotification = useCallback((msg: string, type: string, link?: string) => {
    setNotifications((prev) => [
      { id: `N${Date.now()}`, message: msg, time: "এইমাত্র", read: false, type, link },
      ...prev,
    ]);
  }, []);

  const markNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const allocateResources = useCallback((requestId: string, allocations: { category: string; quantity: number }[]) => {
    setResourceRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: "allocated" as const } : r))
    );
    // Decrement inventory for each allocation
    allocations.forEach(({ category, quantity }) => {
      setInventory((prev) =>
        prev.map((item) => {
          if (item.category === category && item.available >= quantity) {
            const newAvailable = item.available - quantity;
            const newAllocated = item.allocated + quantity;
            const status: InventoryItem["status"] =
              newAvailable === 0 || (newAvailable / item.total) < 0.1 ? "critical" :
              (newAvailable / item.total) < 0.3 ? "low" : "adequate";
            return { ...item, available: newAvailable, allocated: newAllocated, status };
          }
          return item;
        })
      );
    });
    setNotifications((prev) => [
      { id: `N${Date.now()}`, message: `ত্রাণ সফলভাবে বরাদ্দ করা হয়েছে — অনুরোধ ${requestId}`, time: "এইমাত্র", read: false, type: "resource" },
      ...prev,
    ]);
  }, []);

  const adjustInventory = useCallback((id: string, delta: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const newAvailable = Math.max(0, item.available + delta);
        const newTotal = delta > 0 ? item.total + delta : item.total;
        const status: InventoryItem["status"] =
          newAvailable === 0 || (newAvailable / newTotal) < 0.1 ? "critical" :
          (newAvailable / newTotal) < 0.3 ? "low" : "adequate";
        return { ...item, available: newAvailable, total: newTotal, status };
      })
    );
  }, []);

  const addInventoryItem = useCallback((item: InventoryItem) => {
    setInventory((prev) => [...prev, item]);
  }, []);

  const resetDemoData = useCallback(() => {
    setReports(mockReports);
    setTasks(mockTasks);
    setIssues(mockIssues);
    setNotifications(initialNotifications);
    setInventory(mockInventory);
    setResourceRequests(mockResourceRequests);
  }, []);

  return (
    <AppStateContext.Provider value={{
      reports, tasks, issues, notifications, inventory, resourceRequests,
      addReport, updateReportStatus, updateTaskStatus, updateIssueStatus, addIssue, addNotification,
      markNotificationsRead, allocateResources, adjustInventory, addInventoryItem, resetDemoData,
    }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
