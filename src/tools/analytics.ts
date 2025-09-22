import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { ToolDefinition } from "../types/shared";
import { fetchDriverSessionAnalytics } from "../analytics/driver";

// get-drivers tool definition
export const getDriverSessionAnalytics: ToolDefinition = {
  name: "get-driver-session-analytics",
  config: {
    description: `
    Retrieve analytics for a specific driver in a given session.
    
    Session needs to be defined by any of the following optional filters:
    - meeting_key
    - country_name
    - session_type
    - session_name
    - session_key

    Driver needs to be defined by the following optional filters:
    - driver_number

    Response will contain details about:
    - session
    - driver
    - laps
    - best_lap
    - stints
    - pit_stops
    `,
    inputSchema: {
      year: z.number().describe("Year of the F1 season"),
      meeting_key: z
        .number()
        .optional()
        .describe(
          "Meeting key (optional). Use 'latest' to identify the latest or current meeting."
        ),
      country_name: z
        .string()
        .optional()
        .describe("Country name where the session takes place (optional)"),
      session_type: z
        .enum(["Practice", "Qualifying", "Race"])
        .optional()
        .describe(
          'Session type (e.g. "Practice", "Qualifying", "Race") (optional)'
        ),
      session_name: z
        .enum([
          "Practice 1",
          "Practice 2",
          "Practice 3",
          "Sprint Qualifying",
          "Sprint",
          "Qualifying",
          "Race",
        ])
        .optional()
        .describe(
          'Session name (e.g. "Practice 1", "Practice 2", "Practice 3", "Sprint Qualifying", "Sprint", "Qualifying", "Race") (optional)'
        ),
      session_key: z.number().optional().describe("Session key (optional)"),
      driver_number: z.number().describe("Driver number"),
    },
    outputSchema: {},
  },
  execute: async (input: any): Promise<CallToolResult> => {
    const output: any = await fetchDriverSessionAnalytics(input);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(output, null, 2),
        },
      ],
      structuredContent: output,
    };
  },
};
