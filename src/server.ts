import { createServer } from '@modelcontextprotocol/sdk';
import { getRaceSchedule } from './tools/schedule';

async function main() {
  try {
    const server = createServer({
      tools: [getRaceSchedule],
      port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000
    });
    await server.start();
    console.log('MCP Server running on port', server.options.port);
  } catch (err) {
    console.error('Failed to start MCP server:', err);
    process.exit(1);
  }
}

main();
