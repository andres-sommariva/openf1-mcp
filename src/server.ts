import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getRaceResults, getRaceSchedule } from "./tools/schedule";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Create MCP server instance
const server = new McpServer({
  name: "OpenF1 MCP Server",
  version: "0.1.0",
});

// Register tools
[ getRaceResults, getRaceSchedule ].forEach(tool => {
  server.registerTool(
    tool.name,
    tool.config,
    tool.execute
  );
});

async function main() {
  try {
    console.error("Starting MCP server...");
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("MCP Server running on stdio");
  } catch (err) {
    console.error("Failed to start MCP server:", err);
    process.exit(1);
  }
}

main();
