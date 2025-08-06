# OpenF1 MCP Server

This project provides a Model Context Protocol (MCP) server for accessing OpenF1 APIs as tools.

This project is based on the [Model Context Protocol](https://github.com/ModelContextProtocol/modelcontextprotocol) and [OpenF1](https://github.com/openf1/openf1) projects.

## Setup

- Install dependencies: `npm install`
- Build: `npm run build`
- Start: `npm start`
- Dev mode: `npm run dev`

If you want to test the MCP Server using the Model Context Protocol Inspector, you can use the following command:

```bash
npx @modelcontextprotocol/inspector node ./dist/server.js
```

## Project Structure
- `src/` — Source code
  - `server.ts` — MCP server entry point
  - `tools/` — MCP tool definitions
  - `clients/` — OpenF1 API client logic
  - `types/` — TypeScript types/interfaces
  - `utils/` — Utility functions

## Acknowledgments

Special thanks to the [developers and contributors](https://openf1.org/#contributing) of OpenF1 APIs for their hard work and dedication to making Formula 1 data accessible to the public.

## References
- [OpenF1](https://github.com/openf1/openf1)
- [Model Context Protocol](https://github.com/ModelContextProtocol/modelcontextprotocol)
- [typescript-sdk](https://github.com/ModelContextProtocol/typescript-sdk)
- [Zod](https://github.com/colinhacks/zod)
- [Axios](https://github.com/axios/axios)

## Notice

**openf1-mcp** is an unofficial project and is not associated in any way with the Formula 1 companies. F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX and related marks are trade marks of Formula One Licensing B.V. 

