import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  age: integer("age").notNull(),
  status: text("status").notNull(),
  city: text("city"),
  wilaya: text("wilaya"),
  plan: text("plan"),
  skill: text("skill"),
  role: text("role"),
  problemSolving: text("problem_solving"),
  achievement: text("achievement"),
  experience: text("experience"),
  goal: text("goal"),
  hoursPerDay: text("hours_per_day"),
  workLocation: text("work_location"),
  selectedJob: text("selected_job"),
  recommendations: jsonb("recommendations"),
  learningPlan: jsonb("learning_plan"),
  testQuestions: jsonb("test_questions"),
  testScore: integer("test_score"),
  testAnswers: jsonb("test_answers"),
  certificateImage: text("certificate_image"),
  currentStep: integer("current_step").default(1),
  educationCertificate: text("education_certificate"),
  degreeLevel: text("degree_level"),
  fieldOfStudy: text("field_of_study"),
  institution: text("institution"),
  graduationYear: integer("graduation_year"),
  professionalCertificates: jsonb("professional_certificates"),
  languages: jsonb("languages"),
  technicalSkills: jsonb("technical_skills"),
  softSkills: jsonb("soft_skills"),
  yearsOfExperience: text("years_of_experience"),
  previousJobTitle: text("previous_job_title"),
  mainAchievements: text("main_achievements"),
  workSamples: jsonb("work_samples"),
  githubLink: text("github_link"),
  linkedinLink: text("linkedin_link"),
  profileCompletion: integer("profile_completion").default(0),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type CreateUserRequest = InsertUser;
export type UpdateUserRequest = Partial<InsertUser>;
export type UserResponse = User;

export const recommendationSchema = z.object({
  jobs: z.array(z.object({
    title: z.string(),
    description: z.string(),
    salaryRange: z.string(),
    demandLevel: z.string(),
    companies: z.array(z.string()).optional(),
    remotePossible: z.boolean().optional(),
    tips: z.string().optional()
  }))
});

export type RecommendationResponse = z.infer<typeof recommendationSchema>;

export const learningPlanSchema = z.object({
  phases: z.array(z.object({
    days: z.string(),
    title: z.string(),
    desc: z.string(),
    tasks: z.array(z.string()).optional()
  }))
});

export type LearningPlanResponse = z.infer<typeof learningPlanSchema>;

export const testSchema = z.object({
  questions: z.array(z.object({
    id: z.number(),
    text: z.string(),
    options: z.array(z.string()),
    correctAnswer: z.number()
  }))
});

export type TestResponse = z.infer<typeof testSchema>;
