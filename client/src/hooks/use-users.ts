import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type UserInput, type UserUpdateInput } from "@shared/routes";

// Error parsing helper
async function handleResponse<T>(res: Response, successSchema: any): Promise<T> {
  if (!res.ok) {
    let errorMessage = "An error occurred";
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // Ignored
    }
    throw new Error(errorMessage);
  }
  const data = await res.json();
  const parsed = successSchema.safeParse(data);
  if (!parsed.success) {
    console.error("[Zod] Validation failed for API response:", parsed.error.format());
    throw new Error("Invalid response format from server");
  }
  return parsed.data;
}

export function useUser(id: number | null) {
  return useQuery({
    queryKey: [api.users.get.path, id],
    queryFn: async () => {
      if (!id) return null;
      const url = buildUrl(api.users.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      return handleResponse(res, api.users.get.responses[200]);
    },
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UserInput) => {
      const validated = api.users.create.input.parse(data);
      const res = await fetch(api.users.create.path, {
        method: api.users.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      return handleResponse(res, api.users.create.responses[201]);
    },
    onSuccess: (data) => {
      queryClient.setQueryData([api.users.get.path, data.id], data);
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & UserUpdateInput) => {
      const validated = api.users.update.input.parse(updates);
      const url = buildUrl(api.users.update.path, { id });
      const res = await fetch(url, {
        method: api.users.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      return handleResponse(res, api.users.update.responses[200]);
    },
    onSuccess: (data) => {
      queryClient.setQueryData([api.users.get.path, data.id], data);
    },
  });
}

export function useRecommend(id: number | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("User ID required");
      const url = buildUrl(api.users.recommend.path, { id });
      const res = await fetch(url, { method: api.users.recommend.method });
      return handleResponse(res, api.users.recommend.responses[200]);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.users.get.path, id] });
    }
  });
}
