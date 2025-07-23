import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { fetchRaceSchedule } from "../clients/openf1";
import { z } from "zod";

type ToolDefinition = {
  name: string;
  config: {
    description: string;
    inputSchema: any;
    outputSchema: any;
  };
  execute: (input: any) => Promise<CallToolResult>;
};

export const getRaceSchedule: ToolDefinition = {
  name: "getRaceSchedule",
  config: {
    description:
      "Retrieve the F1 race schedule (sessions) for a given year, or all available years if not specified.",
    inputSchema: {
      year: z.number().optional().describe("Year of the F1 season (optional)"),
    },
    outputSchema: {
      sessions: z.array(
        z.object({
          year: z.number(),
          meeting_key: z.number(),
          session_key: z.number(),
          session_type: z.string(),
          session_name: z.string(),
          country_key: z.number(),
          country_code: z.string(),
          country_name: z.string(),
          location: z.string(),
          circuit_key: z.number(),
          circuit_short_name: z.string(),
          date_start: z.string(),
          date_end: z.string(),
          gmt_offset: z.string(),
        })
      ),
    },
  },
  execute: async (input: any): Promise<CallToolResult> => {
    const output: any = await fetchRaceSchedule(input.year);
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
