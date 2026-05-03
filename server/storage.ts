import { db } from "./db";
import {
  users,
  type CreateUserRequest,
  type UpdateUserRequest,
  type UserResponse
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<UserResponse | undefined>;
  createUser(user: CreateUserRequest): Promise<UserResponse>;
  updateUser(id: number, updates: UpdateUserRequest): Promise<UserResponse | undefined>;
  getAllUsers(): Promise<UserResponse[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<UserResponse | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async createUser(user: CreateUserRequest): Promise<UserResponse> {
    const [created] = await db.insert(users).values(user).returning();
    return created;
  }

  async updateUser(id: number, updates: UpdateUserRequest): Promise<UserResponse | undefined> {
    const [updated] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  async getAllUsers(): Promise<UserResponse[]> {
    return await db.select().from(users);
  }
}

export const storage = new DatabaseStorage();
