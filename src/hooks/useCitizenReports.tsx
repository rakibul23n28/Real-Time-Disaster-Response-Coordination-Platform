import { useState, useEffect, useCallback } from "react";
import { apiClient, type Report } from "../lib/api";
import { useAuth } from "./useAuth";

interface UseCitizenReportsOptions {
  autoFetch?: boolean;
  filter?: {
    status?: string;
    disasterType?: string;
  };
}

interface UseCitizenReportsResult {
  reports: Report[];
  loading: boolean;
  error: string | null;
  refreshReports: () => Promise<void>;
  createReport: (input: {
    title: string;
    description: string;
    disasterType: string;
    location: { name: string; district: string; lat: number; lng: number };
    affectedPeople: number;
    files?: File[];
  }) => Promise<Report>;
  getReport: (id: number) => Promise<Report>;
  updateReport: (id: number, updates: Partial<Report>) => Promise<Report>;
  uploadPhoto: (reportId: number, file: File) => Promise<string>;
}

export function useCitizenReports(options?: UseCitizenReportsOptions): UseCitizenReportsResult {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshReports = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const filters: { status?: string; reporterId?: number } = {
        reporterId: user.id,
      };
      if (options?.filter?.status) {
        filters.status = options.filter.status;
      }
      const data = await apiClient.getReports(filters);
      setReports(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch reports";
      setError(message);
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, options?.filter?.status]);

  // Auto-fetch on mount and when filter changes
  useEffect(() => {
    if (options?.autoFetch !== false) {
      refreshReports();
    }
  }, [refreshReports, options?.autoFetch]);

  const createReport = useCallback(
    async (input: {
      title: string;
      description: string;
      disasterType: string;
      location: { name: string; district: string; lat: number; lng: number };
      affectedPeople: number;
      files?: File[];
    }) => {
      try {
        setError(null);
        const report = await apiClient.createReport(input);
        setReports((prev) => [report, ...prev]);
        return report;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create report";
        setError(message);
        throw err;
      }
    },
    []
  );

  const getReport = useCallback(async (id: number) => {
    try {
      setError(null);
      const report = await apiClient.getReportById(id);
      return report;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch report";
      setError(message);
      throw err;
    }
  }, []);

  const updateReport = useCallback(async (id: number, updates: Partial<Report>) => {
    try {
      setError(null);
      const report = await apiClient.updateReport(id, updates);
      setReports((prev) =>
        prev.map((r) => (r.id === id ? report : r))
      );
      return report;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update report";
      setError(message);
      throw err;
    }
  }, []);

  const uploadPhoto = useCallback(async (reportId: number, file: File) => {
    try {
      setError(null);
      const result = await apiClient.uploadReportPhoto(reportId, file);
      return result.url;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to upload photo";
      setError(message);
      throw err;
    }
  }, []);

  return {
    reports,
    loading,
    error,
    refreshReports,
    createReport,
    getReport,
    updateReport,
    uploadPhoto,
  };
}
