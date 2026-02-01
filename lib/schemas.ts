import { z } from "zod";

const StepSchema = z.object({
  order: z.number().int().positive(),
  instruction: z.string().min(1),
  location: z.string().optional(),
  accessibilityInfo: z.string().optional(),
});

const PlanSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  steps: z.array(StepSchema).min(1),
  estimatedTime: z.string().optional(),
  accessibilityNotes: z.array(z.string()).optional(),
});

const ChecklistItemSchema = z.object({
  item: z.string().min(1),
  completed: z.boolean(),
});

export const PlanResponseSchema = z.object({
  summary: z.string().min(1),
  confidenceScore: z.number().min(0).max(100),
  primaryPlan: PlanSchema,
  backupPlans: z.array(PlanSchema).length(2),
  staffScript: z.string().min(1),
  checklist: z.array(ChecklistItemSchema).min(1),
});

export type PlanResponse = z.infer<typeof PlanResponseSchema>;
