import { z } from "zod";
import { insertUserSchema, users, recommendationSchema, learningPlanSchema } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  users: {
    create: {
      method: "POST" as const,
      path: "/api/users" as const,
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/users/:id" as const,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    update: {
      method: "PUT" as const,
      path: "/api/users/:id" as const,
      input: insertUserSchema.partial(),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    recommend: {
      method: "POST" as const,
      path: "/api/users/:id/recommend" as const,
      responses: {
        200: recommendationSchema,
        404: errorSchemas.notFound,
        500: errorSchemas.internal,
      }
    }
  },
  admin: {
    stats: {
      method: "GET" as const,
      path: "/api/admin/stats" as const,
      responses: {
        200: z.object({
          totalUsers: z.number(),
          averageScore: z.number(),
          topJobs: z.array(z.object({ title: z.string(), count: z.number() })),
        }),
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type UserInput = z.infer<typeof api.users.create.input>;
export type UserResponse = z.infer<typeof api.users.create.responses[201]>;
export type UserUpdateInput = z.infer<typeof api.users.update.input>;
