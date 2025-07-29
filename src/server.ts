import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getMeetings, getRaceResults, getRaceSchedule } from "./tools/schedule";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Create MCP server instance
const server = new McpServer(
  {
    name: "OpenF1 MCP Server",
    version: "0.1.0",
  },
  {
    instructions: `This MCP server provides access to F1 race schedule and results.
      Use the get-meetings tool to retrieve a list of meetings (Grand Prix or testing weekends).
      Use the get-race-schedule tool to retrieve a list of sessions for a given meeting.
      Use the get-race-results tool to retrieve the results for a given session.
      
      Example:
      
      Using the get-meetings tool:
      - get-meetings for a given "year" (e.g. 2024)
      - get-meetings for a given "year" and "country_name" (e.g. 2024, "United States")
      - get-meetings for a given "year", "country_name" and "circuit_short_name" (e.g. 2024, "United States", "Sakhir")
      
      Using the get-race-schedule tool:
      - get-race-schedule for a given "year" and "meeting_key" (e.g. 2024, 1)
      - get-race-schedule for a given "year", "meeting_key" and "session_type" (e.g. 2024, 1, "Practice")
      - get-race-schedule for a given "year", "meeting_key", "session_type" and "session_name" (e.g. 2024, 1, "Practice", "Practice 1")
      
      Using the get-race-results tool:
      - get-race-results for a given "session_key" (e.g. 1)
      - get-race-results for a given "session_key" and "driver_number" (e.g. 1, 1)
      `,
  }
);

// Register tools
[getMeetings, getRaceSchedule, getRaceResults].forEach((tool) => {
  server.registerTool(tool.name, tool.config, tool.execute);
});

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
