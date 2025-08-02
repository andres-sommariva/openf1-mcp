import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { fetchLaps } from "../clients/openf1";
import { ToolDefinition } from "../types/shared";

// get-laps tool definition
export const getLaps: ToolDefinition = {
  name: "get-laps",
  config: {
    description: `Retrieve lap data for a specific F1 session. 
      Provides detailed telemetry and timing information for each lap, including:
      - Sector times and speeds
      - Pit stop information
      - Speed trap data
      - Lap timing and duration
      
      Required parameters:
      - session_key: The unique identifier for the session
      
      Optional filters:
      - driver_number: Filter by driver number
      - lap_number: Filter by specific lap number`,
    inputSchema: {
      session_key: z
        .number()
        .describe("The unique identifier for the session (required)"),
      driver_number: z
        .number()
        .optional()
        .describe("Filter by driver number (optional)"),
      lap_number: z
        .number()
        .optional()
        .describe("Filter by specific lap number (optional)"),
    },
    outputSchema: {
      laps: z.array(
        z.object({
          meeting_key: z.number().describe("The unique identifier for the meeting"),
          session_key: z.number().describe("The unique identifier for the session"),
          driver_number: z.number().describe("The driver's number"),
          lap_number: z.number().describe("The lap number"),
          lap_duration: z
            .number()
            .nullable()
            .describe("Total duration of the lap in seconds (if available)"),
          is_pit_out_lap: z.boolean().describe("Whether this is a pit out lap"),
          // Sector times
          duration_sector_1: z
            .number()
            .nullable()
            .describe("Duration of sector 1 in seconds (if available)"),
          duration_sector_2: z
            .number()
            .nullable()
            .describe("Duration of sector 2 in seconds (if available)"),
          duration_sector_3: z
            .number()
            .nullable()
            .describe("Duration of sector 3 in seconds (if available)"),
          // Speed traps
          i1_speed: z
            .number()
            .nullable()
            .describe("Speed at intermediate 1 in km/h (if available)"),
          i2_speed: z
            .number()
            .nullable()
            .describe("Speed at intermediate 2 in km/h (if available)"),
          st_speed: z
            .number()
            .nullable()
            .describe("Speed at speed trap in km/h (if available)"),
          // Timing information
          date_start: z
            .string()
            .nullable()
            .describe("UTC timestamp when the lap started in ISO 8601 format (if available)"),
          // Sector session times
          segments_sector_1: z
            .array(z.number().or(z.null()))
            .describe("A list of values representing the 'mini-sectors' within the first sector"),
          segments_sector_2: z
            .array(z.number().or(z.null()))
            .describe("A list of values representing the 'mini-sectors' within the second sector"),
          segments_sector_3: z
            .array(z.number().or(z.null()))
            .describe("A list of values representing the 'mini-sectors' within the third sector"),
        })
      ),
    },
  },
  execute: async (input: any): Promise<CallToolResult> => {
    const output: any = await fetchLaps(input);
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

function transformToMiniSectorsColor(miniSectors: any[]): string[] {
  return miniSectors.map((miniSector) => {
    if (miniSector === 0) return "not available";
    if (miniSector === 2048) return "yellow";
    if (miniSector === 2049) return "green";
    if (miniSector === 2051) return "purple";
    return "unknown";
  });
}
  