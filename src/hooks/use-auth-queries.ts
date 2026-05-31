import {
  useGetUserReports,
  useCreateReport,
  useGetAdminReports,
  useUpdateReportStatus,
  useGetAdminStats,
  type GetAdminReportsParams,
  type CreateReportRequest,
  type UpdateStatusRequest
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

// Auth headers are attached globally by the API client's auth-token getter,
// configured once in src/main.tsx (reads `fire_alert_token` from localStorage).
// These hooks only add query keys, polling, and cache invalidation.

export function useMyReports() {
  return useGetUserReports();
}

export function useSubmitReport() {
  const queryClient = useQueryClient();

  const mutation = useCreateReport({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      }
    }
  });

  return {
    ...mutation,
    mutateAsync: (data: CreateReportRequest) => mutation.mutateAsync({ data })
  };
}

export function useAdminReports(params?: GetAdminReportsParams) {
  return useGetAdminReports(params, {
    query: {
      queryKey: ["/api/admin/reports", params],
      refetchInterval: 10000, // Poll every 10 seconds
    }
  });
}

export function useAdminStats() {
  return useGetAdminStats({
    query: {
      queryKey: ["/api/admin/stats"],
      refetchInterval: 10000,
    }
  });
}

export function useAdminUpdateStatus() {
  const queryClient = useQueryClient();

  const mutation = useUpdateReportStatus({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/reports"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      }
    }
  });

  return {
    ...mutation,
    mutateAsync: (id: number, data: UpdateStatusRequest) => mutation.mutateAsync({ id, data })
  };
}
