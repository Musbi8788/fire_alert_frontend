import { useAuth } from "@/lib/auth-context";
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

// Helper hook to inject auth headers into Orval queries/mutations
function useAuthHeaders() {
  const { token } = useAuth();
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
}

export function useMyReports() {
  const headers = useAuthHeaders();
  return useGetUserReports({
    request: headers
  });
}

export function useSubmitReport() {
  const headers = useAuthHeaders();
  const queryClient = useQueryClient();
  
  const mutation = useCreateReport({
    request: headers,
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
  const headers = useAuthHeaders();
  return useGetAdminReports(params, {
    request: headers,
    query: {
      queryKey: ["/api/admin/reports", params],
      refetchInterval: 10000, // Poll every 10 seconds
    }
  });
}

export function useAdminStats() {
  const headers = useAuthHeaders();
  return useGetAdminStats({
    request: headers,
    query: {
      queryKey: ["/api/admin/stats"],
      refetchInterval: 10000,
    }
  });
}

export function useAdminUpdateStatus() {
  const headers = useAuthHeaders();
  const queryClient = useQueryClient();
  
  const mutation = useUpdateReportStatus({
    request: headers,
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
