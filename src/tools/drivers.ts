import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { fetchDrivers } from "../clients/openf1";
import { ToolDefinition } from "../types/shared";

// get-drivers tool definition
export const getDrivers: ToolDefinition = {
  name: "get-drivers",
  config: {
    description: `Retrieve driver information from OpenF1.
      Provides details about F1 drivers including:
      - Driver names and numbers
      - Team information
      - Country codes
      - Profile images (when available)
      
      Optional filters:
      - session_key: Filter drivers by session
      - meeting_key: Filter drivers by meeting/event
      - driver_number: Filter drivers by driver number
      
      At least one filter is required.`,
    inputSchema: {
      session_key: z
        .number()
        .optional()
        .describe("Filter by session key (optional)"),
      meeting_key: z
        .number()
        .optional()
        .describe("Filter by meeting key (optional)"),
      driver_number: z
        .number()
        .optional()
        .describe("Filter by driver number (optional)"),
    },
    outputSchema: {
      drivers: z.array(
        z.object({
          session_key: z
            .number()
            .describe("The session key this data is associated with"),
          meeting_key: z
            .number()
            .describe("The meeting key this data is associated with"),
          driver_number: z.number().nullable().describe("The driver's number"),
          broadcast_name: z
            .string()
            .nullable()
            .describe("Name used in broadcasts (if available)"),
          full_name: z.string().nullable().describe("Driver's full name (if available)"),
          name_acronym: z
            .string()
            .nullable()
            .describe("Short acronym of driver's name (if available)"),
          team_name: z
            .string()
            .nullable()
            .describe("Name of the driver's team (if available)"),
          team_colour: z
            .string()
            .nullable()
            .describe("Hex color code of the team (if available)"),
          first_name: z.string().nullable().describe("Driver's first name (if available)"),
          last_name: z.string().nullable().describe("Driver's last name (if available)"),
          headshot_url: z
            .string()
            .nullable()
            .describe("URL to driver's headshot image (if available)"),
          country_code: z
            .string()
            .nullable()
            .describe("ISO country code (if available)"),
        })
      ),
    },
  },
  execute: async (input: any): Promise<CallToolResult> => {
    const output: any = await fetchDrivers(input);
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
