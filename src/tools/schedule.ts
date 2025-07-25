import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { fetchRaceSchedule, fetchRaceResults } from "../clients/openf1";
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

// get-race-schedule tool definition
export const getRaceSchedule: ToolDefinition = {
  name: "get-race-schedule",
  config: {
    description: `Retrieve the F1 race schedule (sessions) for a given year, or all available years if not specified. 
      Optionally filter by:
      - country name
      - session type (e.g. "Practice", "Qualifying", "Race")
      - session name (e.g. "Practice 1", "Practice 2", "Practice 3", "Sprint Qualifying", "Sprint", "Qualifying", "Race")`,
    inputSchema: {
      year: z.number().optional().describe("Year of the F1 season (optional)"),
      country_name: z
        .string()
        .optional()
        .describe("Country name where the event takes place (optional)"),
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
    const output: any = await fetchRaceSchedule(input);
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

// get-race-results tool definition
export const getRaceResults: ToolDefinition = {
  name: "get-race-results",
  config: {
    description: `Retrieve the results for a given F1 session, identified by session_key. 
    Results include position, driver, time, laps, and status (dnf, dns, dsq).`,
    inputSchema: {
      session_key: z.number().describe("Session key (required)"),
      driver_number: z.number().optional().describe("Driver number (optional)"),
    },
    outputSchema: {
      results: z.array(
        z.object({
          dnf: z
            .boolean()
            .describe(
              "Indicates whether the driver Did Not Finish the race. This can be true only for race sessions."
            ),
          dns: z
            .boolean()
            .describe(
              "Indicates whether the driver Did Not Start the race. This can be true only for race or qualifying sessions."
            ),
          dsq: z
            .boolean()
            .describe("Indicates whether the driver was disqualified."),
          driver_number: z
            .number()
            .describe(
              "The unique number assigned to an F1 driver (cf. Wikipedia)."
            ),
          duration: z
            .number()
            .or(z.array(z.number()))
            .or(z.null())
            .describe(
              "Either the best lap time (for practice or qualifying), or the total race time (for races), in seconds. In qualifying, this is an array of three values for Q1, Q2, and Q3."
            ),
          gap_to_leader: z
            .number()
            .or(z.array(z.number()))
            .or(z.string())
            .or(z.null())
            .describe(
              'The time gap to the session leader in seconds, or "+N LAP(S)" if the driver was lapped. In qualifying, this is an array of three values for Q1, Q2, and Q3.'
            ),
          number_of_laps: z
            .number()
            .or(z.null())
            .describe("Total number of laps completed during the session."),
          meeting_key: z
            .number()
            .describe(
              "The unique identifier for the meeting. Use latest to identify the latest or current meeting."
            ),
          position: z
            .number()
            .or(z.null())
            .describe("The final position of the driver in the session."),
          points: z
            .number()
            .optional()
            .describe("The points earned by the driver in the session."),
          session_key: z
            .number()
            .describe(
              "The unique identifier for the session. Use latest to identify the latest or current session."
            ),
        })
      ),
    },
  },
  execute: async (input: any): Promise<CallToolResult> => {
    const output: any = await fetchRaceResults(input);
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
