import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { ToolDefinition } from "../types/shared";
import {
  fetchMeetings,
  fetchSessions,
  fetchSessionResults,
} from "../clients/openf1";

// get-meetings tool definition
export const getMeetings: ToolDefinition = {
  name: "get-meetings",
  config: {
    description: `Retrieve F1 meetings (Grand Prix or testing weekends). 
      Provides information about meetings. A meeting refers to a Grand Prix or testing weekend and usually includes multiple sessions (practice, qualifying, race, ...).
      Optionally filter by:
      - year
      - country name (e.g. "Bahrain", "Australia", "Japan", "Italy", "United States", "Monaco", "Austria", "Brazil", "Canada", "Singapore", "United Arab Emirates", "Saudi Arabia", "Qatar", "China", "India", "Mexico")
      - circuit short name (e.g. "Sakhir", "Melbourne", "Suzuka", "Imola", "Miami", etc.)`,
    inputSchema: {
      year: z.number().optional().describe("Year of the F1 season (optional)"),
      country_name: z
        .string()
        .optional()
        .describe("Country name where the event takes place (optional)"),
      circuit_short_name: z
        .string()
        .optional()
        .describe("Circuit short name (optional)"),
    },
    outputSchema: {
      meetings: z.array(
        z.object({
          circuit_key: z
            .number()
            .describe(
              "The unique identifier for the circuit where the event takes place."
            ),
          circuit_short_name: z
            .string()
            .describe(
              "The short or common name of the circuit where the event takes place."
            ),
          country_code: z
            .string()
            .describe("A code that uniquely identifies the country."),
          country_key: z
            .number()
            .describe(
              "The unique identifier for the country where the event takes place."
            ),
          country_name: z
            .string()
            .describe(
              "The full name of the country where the event takes place."
            ),
          date_start: z
            .string()
            .describe("The UTC starting date and time, in ISO 8601 format."),
          gmt_offset: z
            .string()
            .describe(
              "The difference in hours and minutes between local time at the location of the event and Greenwich Mean Time (GMT)."
            ),
          location: z
            .string()
            .describe(
              "The city or geographical location where the meeting takes place."
            ),
          meeting_key: z
            .number()
            .describe(
              "The unique identifier for the meeting. Use 'latest' to identify the latest or current meeting."
            ),
          meeting_name: z.string().describe("The name of the meeting."),
          meeting_official_name: z
            .string()
            .describe("The official name of the meeting."),
          year: z.number().describe("The year the meeting takes place."),
        })
      ),
    },
  },
  execute: async (input: any): Promise<CallToolResult> => {
    const output: any = await fetchMeetings(input);
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

// get-sessions tool definition
export const getSessions: ToolDefinition = {
  name: "get-sessions",
  config: {
    description: `Retrieve the F1 race schedule (sessions) for a given year, or all available years if not specified. 
      Optionally filter by:
      - meeting key (will return all sessions for the given meeting)
      - country name (will return all sessions for the given country)
      - session type (e.g. "Practice", "Qualifying", "Race")
      - session name (e.g. "Practice 1", "Practice 2", "Practice 3", "Sprint Qualifying", "Sprint", "Qualifying", "Race")`,
    inputSchema: {
      year: z.number().optional().describe("Year of the F1 season (optional)"),
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
    },
    outputSchema: {
      sessions: z.array(
        z.object({
          year: z.number().describe("The year the session takes place."),
          meeting_key: z
            .number()
            .describe(
              "The unique identifier for the meeting. Use 'latest' to identify the latest or current meeting."
            ),
          session_key: z
            .number()
            .describe(
              "The unique identifier for the session. Use 'latest' to identify the latest or current session."
            ),
          session_type: z
            .string()
            .describe(
              "The type of the session (Practice, Qualifying, Race, ...)."
            ),
          session_name: z
            .string()
            .describe(
              "The name of the session (Practice 1, Qualifying, Race, ...)."
            ),
          country_key: z
            .number()
            .describe(
              "The unique identifier for the country where the session takes place."
            ),
          country_code: z
            .string()
            .describe("A code that uniquely identifies the country."),
          country_name: z
            .string()
            .describe(
              "The full name of the country where the session takes place."
            ),
          location: z
            .string()
            .describe(
              "The city or geographical location where the session takes place."
            ),
          circuit_key: z
            .number()
            .describe(
              "The unique identifier for the circuit where the session takes place."
            ),
          circuit_short_name: z
            .string()
            .describe(
              "The short or common name of the circuit where the session takes place."
            ),
          date_start: z
            .string()
            .describe("The UTC starting date and time, in ISO 8601 format."),
          date_end: z
            .string()
            .describe("The UTC ending date and time, in ISO 8601 format."),
          gmt_offset: z
            .string()
            .describe(
              "The difference in hours and minutes between local time at the location of the event and Greenwich Mean Time (GMT)."
            ),
        })
      ),
    },
  },
  execute: async (input: any): Promise<CallToolResult> => {
    const output: any = await fetchSessions(input);
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

// get-session-results tool definition
export const getSessionResults: ToolDefinition = {
  name: "get-session-results",
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
            .or(z.array(z.number().or(z.null())))
            .or(z.null())
            .describe(
              "Either the best lap time (for practice or qualifying), or the total race time (for races), in seconds. In qualifying, this is an array of three values for Q1, Q2, and Q3."
            ),
          gap_to_leader: z
            .number()
            .or(z.array(z.number().or(z.null())))
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
    const output: any = await fetchSessionResults(input);
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
