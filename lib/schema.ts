import { z } from "zod";

// Step schema
export const StepSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  accessibility_notes: z.array(z.string()),
  estimated_time_mins: z.number().int().nonnegative(),
  walking_mins: z.number().int().nonnegative(),
  sensory_notes: z.array(z.string()),
  risk_flags: z.array(z.string()),
});

export type Step = z.infer<typeof StepSchema>;

// Primary plan schema
export const PrimaryPlanSchema = z.object({
  title: z.string().min(1),
  steps: z.array(StepSchema).min(1),
});

export type PrimaryPlan = z.infer<typeof PrimaryPlanSchema>;

// Backup plan schema
export const BackupPlanSchema = z.object({
  name: z.string().min(1),
  reason: z.string().min(1),
  steps: z.array(StepSchema).min(1),
});

export type BackupPlan = z.infer<typeof BackupPlanSchema>;

// Main response schema
export const PlanResponseSchema = z.object({
  summary: z.string().min(1),
  assumptions: z.array(z.string()),
  confidence_score: z.number().min(0).max(100),
  confidence_rationale: z.string().min(1),
  primary_plan: PrimaryPlanSchema,
  backup_plans: z.array(BackupPlanSchema).length(2),
  staff_script: z.array(z.string()).min(1),
  before_you_leave_checklist: z.array(z.string()).min(1),
  risk_flags: z.array(z.string()),
});

export type PlanResponse = z.infer<typeof PlanResponseSchema>;

// Input request body schema
export const PlanRequestSchema = z.object({
  start: z.string().min(1),
  destination: z.string().min(1),
  dateTime: z.string().optional(),
  needs: z.string().optional(),
  disruption: z.string().optional(),
});

export type PlanRequest = z.infer<typeof PlanRequestSchema>;

// Example JSON object that passes the schema
export const examplePlanResponse: PlanResponse = {
  summary: "Journey from King's Cross Station to London Bridge using step-free routes via the Northern Line, with one change at Bank station. Total journey time approximately 35 minutes.",
  assumptions: [
    "Traveler requires step-free access",
    "Standard service operation (no planned disruptions)",
    "Traveler can navigate between platforms independently",
  ],
  confidence_score: 85,
  confidence_rationale: "High confidence due to well-documented step-free routes on the Northern Line. Lower confidence due to potential unplanned disruptions or lift maintenance.",
  primary_plan: {
    title: "Step-Free Route via Northern Line",
    steps: [
      {
        title: "Start at King's Cross Station",
        description: "Enter via the main entrance and proceed to the Northern Line platform using the step-free route via lifts.",
        accessibility_notes: [
          "Lift available from street level to ticket hall",
          "Lift from ticket hall to Northern Line platform",
          "Platform has tactile paving",
        ],
        estimated_time_mins: 5,
        walking_mins: 3,
        sensory_notes: [
          "Bright lighting in ticket hall",
          "Audio announcements available",
        ],
        risk_flags: [],
      },
      {
        title: "Take Northern Line to Bank",
        description: "Board southbound Northern Line train towards Morden. Journey time approximately 15 minutes.",
        accessibility_notes: [
          "Step-free boarding at King's Cross",
          "Priority seating available",
          "Audio and visual announcements",
        ],
        estimated_time_mins: 15,
        walking_mins: 0,
        sensory_notes: [
          "Train can be noisy",
          "Visual displays show next station",
        ],
        risk_flags: [],
      },
      {
        title: "Change at Bank Station",
        description: "Alight at Bank station and use the step-free interchange route to reach the Northern Line platform for trains towards London Bridge.",
        accessibility_notes: [
          "Step-free interchange via lifts",
          "Follow signage for Northern Line (City branch)",
          "Tactile paving throughout",
        ],
        estimated_time_mins: 8,
        walking_mins: 5,
        sensory_notes: [
          "Busy interchange during peak times",
          "Multiple audio announcements",
        ],
        risk_flags: ["Lift maintenance possible during off-peak hours"],
      },
      {
        title: "Take Northern Line to London Bridge",
        description: "Board northbound Northern Line train towards Edgware. Journey time approximately 5 minutes.",
        accessibility_notes: [
          "Step-free boarding at Bank",
          "Priority seating available",
        ],
        estimated_time_mins: 5,
        walking_mins: 0,
        sensory_notes: [
          "Visual displays show next station",
          "Audio announcements",
        ],
        risk_flags: [],
      },
      {
        title: "Arrive at London Bridge",
        description: "Alight at London Bridge station and use the step-free route via lifts to exit.",
        accessibility_notes: [
          "Lift available from platform to street level",
          "Tactile paving on platform",
        ],
        estimated_time_mins: 2,
        walking_mins: 2,
        sensory_notes: [
          "Bright lighting",
          "Audio announcements for exits",
        ],
        risk_flags: [],
      },
    ],
  },
  backup_plans: [
    {
      name: "Alternative Route via Circle Line",
      reason: "Use if Northern Line is disrupted or lifts are out of service at Bank station.",
      steps: [
        {
          title: "Start at King's Cross Station",
          description: "Enter via main entrance and proceed to Circle Line platform using step-free route.",
          accessibility_notes: [
            "Lift available to Circle Line platform",
            "Platform has tactile paving",
          ],
          estimated_time_mins: 5,
          walking_mins: 3,
          sensory_notes: ["Audio announcements available"],
          risk_flags: [],
        },
        {
          title: "Take Circle Line to Monument",
          description: "Board eastbound Circle Line train. Journey time approximately 12 minutes.",
          accessibility_notes: [
            "Step-free boarding",
            "Priority seating available",
          ],
          estimated_time_mins: 12,
          walking_mins: 0,
          sensory_notes: ["Visual displays show next station"],
          risk_flags: [],
        },
        {
          title: "Walk from Monument to London Bridge",
          description: "Exit Monument station and walk approximately 5 minutes to London Bridge station via step-free street route.",
          accessibility_notes: [
            "Step-free street route",
            "Pedestrian crossings with audio signals",
          ],
          estimated_time_mins: 7,
          walking_mins: 5,
          sensory_notes: [
            "Busy street environment",
            "Traffic noise present",
          ],
          risk_flags: ["Weather-dependent", "Requires street navigation"],
        },
      ],
    },
    {
      name: "Bus Route Alternative",
      reason: "Use if all tube lines are disrupted or traveler prefers above-ground transport.",
      steps: [
        {
          title: "Start at King's Cross Station",
          description: "Exit station and locate bus stop for route 63 or 43.",
          accessibility_notes: [
            "Step-free exit from station",
            "Bus stops have audio announcements",
          ],
          estimated_time_mins: 3,
          walking_mins: 2,
          sensory_notes: ["Street-level environment"],
          risk_flags: [],
        },
        {
          title: "Take Bus to London Bridge",
          description: "Board accessible bus (route 63 or 43) heading towards London Bridge. Journey time approximately 25 minutes depending on traffic.",
          accessibility_notes: [
            "Low-floor accessible buses",
            "Priority seating available",
            "Driver can announce stops",
          ],
          estimated_time_mins: 25,
          walking_mins: 0,
          sensory_notes: [
            "Visual displays show next stop",
            "Audio announcements available",
          ],
          risk_flags: ["Traffic delays possible", "Less reliable timing"],
        },
        {
          title: "Arrive at London Bridge",
          description: "Alight at London Bridge bus stop.",
          accessibility_notes: [
            "Step-free alighting",
            "Bus stop has tactile paving",
          ],
          estimated_time_mins: 1,
          walking_mins: 1,
          sensory_notes: ["Street-level environment"],
          risk_flags: [],
        },
      ],
    },
  ],
  staff_script: [
    "Hello, I'm here to help you plan your journey from King's Cross to London Bridge.",
    "The recommended route uses the Northern Line with a change at Bank station, all step-free.",
    "The journey should take about 35 minutes, but please allow extra time during peak hours.",
    "There are two backup options available if needed: an alternative tube route or a bus route.",
    "Would you like me to go through any specific part of the journey in more detail?",
  ],
  before_you_leave_checklist: [
    "Check TfL website for any service disruptions on Northern Line",
    "Verify lift status at King's Cross, Bank, and London Bridge stations",
    "Ensure you have your Oyster card or contactless payment ready",
    "Allow extra time during peak hours (7-9am, 5-7pm)",
    "Have backup plan details saved or printed",
    "Check weather if using bus alternative",
  ],
  risk_flags: [
    "Lift maintenance possible at Bank station during off-peak hours",
    "Northern Line can experience delays during peak times",
    "Bus alternative subject to traffic conditions",
  ],
};
