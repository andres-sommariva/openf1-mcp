import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getMeetings, getSessions, getSessionResults } from "./tools/schedule";
import { getLaps } from "./tools/laps";
import { getDrivers } from "./tools/drivers";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server_instructions = `
  This MCP server provides access to F1 race schedule (sessions) and results (session-results).
    Use the get-meetings tool to retrieve a list of meetings (Grand Prix or testing weekends).
    Use the get-sessions tool to retrieve a list of sessions for a given meeting.
    Use the get-session-results tool to retrieve the results for a given session.
    Use the get-laps tool to retrieve the laps for a given session.
    Use the get-drivers tool to retrieve the drivers for a given session.
    
    Example:
    
    Using the get-meetings tool:
    - get-meetings for a given "year" (e.g. 2024)
    - get-meetings for a given "year" and "country_name" (e.g. 2024, "United States")
    - get-meetings for a given "year", "country_name" and "circuit_short_name" (e.g. 2024, "United States", "Sakhir")
    
    Using the get-sessions tool:
    - get-sessions for a given "year" and "meeting_key" (e.g. 2024, 1)
    - get-sessions for a given "year", "meeting_key" and "session_type" (e.g. 2024, 1, "Practice")
    - get-sessions for a given "year", "meeting_key", "session_type" and "session_name" (e.g. 2024, 1, "Practice", "Practice 1")
    
    Using the get-session-results tool:
    - get-session-results for a given "session_key" (e.g. 1)
    - get-session-results for a given "session_key" and "driver_number" (e.g. 1, 1)

    Using the get-laps tool:
    - get-laps for a given "session_key" (e.g. 1)
    - get-laps for a given "session_key" and "driver_number" (e.g. 1, 1)
    - get-laps for a given "session_key", "driver_number" and "lap_number" (e.g. 1, 1, 1)
    
    Using the get-drivers tool:
    - get-drivers for a given "session_key" (e.g. 1)
    - get-drivers for a given "session_key" and "driver_number" (e.g. 1, 1)
    
    Logical Model:
    - meetings: meetings are identified by a "meeting_key". You can get all sessions for a race weekend by using the "meeting_key".
    - sessions: sessions are identified by a "session_key". You can get all results for a session by using the "session_key".
    - session-results: you can get results for a session by using the "session_key", or all the meetings results by using the "meeting_key".
    - laps: laps are identified by a "session_key". You can get all laps for a session by using the "session_key".
    - drivers: drivers are identified by a "driver_number". You can get all drivers for a session by using the "session_key".
  `;

// Create MCP server instance
const server = new McpServer(
  {
    name: "OpenF1 MCP Server",
    version: "0.1.0",
  },
  {
    instructions: server_instructions,
  }
);

// Register tools
[getMeetings, getSessions, getSessionResults, getLaps, getDrivers].forEach(
  (tool) => {
    server.registerTool(tool.name, tool.config, tool.execute);
  }
);

async function main() {
  try {
    console.warn("Starting MCP server...");
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.warn("MCP Server running on stdio");
  } catch (err) {
    console.error("Failed to start MCP server:", err);
    process.exit(1);
  }
}

main();
