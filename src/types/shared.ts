// TypeScript types/interfaces for shared data

import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export type ToolDefinition = {
  name: string;
  config: {
    description: string;
    inputSchema: any;
    outputSchema: any;
  };
  execute: (input: any) => Promise<CallToolResult>;
};
