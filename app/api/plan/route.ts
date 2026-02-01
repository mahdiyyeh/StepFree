import { NextRequest, NextResponse } from "next/server";
import { PlanRequestSchema, PlanResponseSchema } from "@/lib/schema";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompt";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-5-20250929";
const MAX_TOKENS = 4000;

// JSON Schema for Structured Outputs (matches Zod schema)
const PLAN_RESPONSE_JSON_SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string" },
    assumptions: {
      type: "array",
      items: { type: "string" },
    },
    confidence_score: {
      type: "number",
    },
    confidence_rationale: { type: "string" },
    primary_plan: {
      type: "object",
      properties: {
        title: { type: "string" },
        steps: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              accessibility_notes: {
                type: "array",
                items: { type: "string" },
              },
              estimated_time_mins: { type: "integer" },
              walking_mins: { type: "integer" },
              sensory_notes: {
                type: "array",
                items: { type: "string" },
              },
              risk_flags: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: [
              "title",
              "description",
              "accessibility_notes",
              "estimated_time_mins",
              "walking_mins",
              "sensory_notes",
              "risk_flags",
            ],
            additionalProperties: false,
          },
          minItems: 1,
        },
      },
      required: ["title", "steps"],
      additionalProperties: false,
    },
    backup_plans: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          reason: { type: "string" },
          steps: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                accessibility_notes: {
                  type: "array",
                  items: { type: "string" },
                },
                estimated_time_mins: { type: "integer" },
                walking_mins: { type: "integer" },
                sensory_notes: {
                  type: "array",
                  items: { type: "string" },
                },
                risk_flags: {
                  type: "array",
                  items: { type: "string" },
                },
              },
              required: [
                "title",
                "description",
                "accessibility_notes",
                "estimated_time_mins",
                "walking_mins",
                "sensory_notes",
                "risk_flags",
              ],
              additionalProperties: false,
            },
            minItems: 1,
          },
        },
        required: ["name", "reason", "steps"],
        additionalProperties: false,
      },
      minItems: 1,
    },
    staff_script: {
      type: "array",
      items: { type: "string" },
      minItems: 1,
    },
    before_you_leave_checklist: {
      type: "array",
      items: { type: "string" },
      minItems: 1,
    },
    risk_flags: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: [
    "summary",
    "assumptions",
    "confidence_score",
    "confidence_rationale",
    "primary_plan",
    "backup_plans",
    "staff_script",
    "before_you_leave_checklist",
    "risk_flags",
  ],
  additionalProperties: false,
};

async function callClaude(
  systemPrompt: string,
  userPrompt: string
): Promise<{ content: string; model: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable is not set");
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
      output_config: {
        format: {
          type: "json_schema",
          schema: PLAN_RESPONSE_JSON_SCHEMA,
        },
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Anthropic API error: ${response.status} ${errorText}`
    );
  }

  const data = await response.json();
  
  // Check if Structured Outputs returned the data in a different format
  if (data.content && Array.isArray(data.content)) {
    const firstContent = data.content[0];
    
    // Structured Outputs might return the JSON directly in content[0].text
    if (firstContent?.type === "text" && typeof firstContent.text === "string") {
      return {
        content: firstContent.text.trim(),
        model: data.model || MODEL,
      };
    }
    
    // If it's not text, it might be in a different format
    if (firstContent?.type !== "text") {
      throw new Error(`Unexpected content type from Structured Outputs: ${firstContent?.type}`);
    }
  }
  
  // Fallback: try to get text content
  const content = data.content?.[0]?.text;
  if (!content || typeof content !== "string") {
    throw new Error(`Invalid response format from Anthropic API. Response structure: ${JSON.stringify(data).substring(0, 500)}`);
  }

  return {
    content: content.trim(),
    model: data.model || MODEL,
  };
}

function parseJsonSafely(text: string): { success: true; data: unknown } | { success: false; error: string } {
  try {
    // Remove markdown code blocks if present
    let cleaned = text.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json\n?/i, "").replace(/\n?```$/i, "");
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```\n?/, "").replace(/\n?```$/, "");
    }
    cleaned = cleaned.trim();

    const parsed = JSON.parse(cleaned);
    return { success: true, data: parsed };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown JSON parse error",
    };
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let repaired = false;

  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = PlanRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid request body", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const input = validationResult.data;

    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { ok: false, error: "ANTHROPIC_API_KEY environment variable is not set" },
        { status: 500 }
      );
    }

    // Build prompts
    const userPrompt = buildUserPrompt(input);

    // Call Claude with Structured Outputs (guarantees valid JSON)
    let claudeResponse = await callClaude(SYSTEM_PROMPT, userPrompt);
    
    // With Structured Outputs, the response is guaranteed to be valid JSON
    let parsedData: unknown;
    try {
      // Try parsing the content
      const contentToParse = claudeResponse.content.trim();
      
      // Check if it's already an object (shouldn't happen with Structured Outputs, but handle it)
      if (typeof contentToParse === "object") {
        parsedData = contentToParse;
      } else {
        parsedData = JSON.parse(contentToParse);
      }
    } catch (error) {
      // Log more details for debugging
      console.error("JSON parse error:", error);
      console.error("Response content (first 1000 chars):", claudeResponse.content.substring(0, 1000));
      
      return NextResponse.json(
        {
          ok: false,
          error: "Failed to parse Claude response as JSON (unexpected with Structured Outputs)",
          debug: {
            rawResponse: claudeResponse.content.substring(0, 1000),
            parseError: error instanceof Error ? error.message : "Unknown error",
            contentLength: claudeResponse.content.length,
            contentPreview: claudeResponse.content.substring(0, 200),
          },
        },
        { status: 500 }
      );
    }

    // Validate against schema (should always pass with Structured Outputs, but keep as safety check)
    let schemaValidation = PlanResponseSchema.safeParse(parsedData);

    // With Structured Outputs, validation should always pass, but handle edge cases
    if (!schemaValidation.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Response failed schema validation (unexpected with Structured Outputs)",
          debug: {
            validationErrors: schemaValidation.error.errors.map((e) =>
              `${e.path.join(".")}: ${e.message}`
            ),
            rawResponse: claudeResponse.content.substring(0, 500),
          },
        },
        { status: 500 }
      );
    }

    // Validate backup_plans count (Structured Outputs only supports minItems: 0 or 1)
    if (schemaValidation.data.backup_plans.length !== 2) {
      return NextResponse.json(
        {
          ok: false,
          error: `Expected exactly 2 backup plans, got ${schemaValidation.data.backup_plans.length}`,
          debug: {
            backupPlansCount: schemaValidation.data.backup_plans.length,
            rawResponse: claudeResponse.content.substring(0, 500),
          },
        },
        { status: 500 }
      );
    }

    // Success
    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      ok: true,
      data: schemaValidation.data,
      debug: {
        model: claudeResponse.model,
        latency_ms: latencyMs,
        repaired,
      },
    });
  } catch (error) {
    const latencyMs = Date.now() - startTime;

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        debug: {
          latency_ms: latencyMs,
          repaired,
        },
      },
      { status: 500 }
    );
  }
}
