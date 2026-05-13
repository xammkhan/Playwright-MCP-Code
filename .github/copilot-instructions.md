# Playwright MCP Server Instructions

This project implements a Model Context Protocol (MCP) server for browser automation using Playwright. It provides tools for navigating web pages, interacting with elements, and extracting content.

## Architecture Overview

- **Core Component**: MCP server (`src/index.ts`) that exposes browser automation tools via stdio transport.
- **Browser Engine**: Uses Playwright's Chromium for headless browser control.
- **Tool Pattern**: Each tool is defined with a name, description, and Zod-validated input schema.
- **State Management**: Browser and page instances are lazily initialized and shared across tool calls.

## Key Files and Directories

- `src/index.ts`: Main server implementation with tool definitions and Playwright integration.
- `package.json`: Project dependencies including `@modelcontextprotocol/sdk`, `playwright`, and `zod`.
- `tsconfig.json`: TypeScript configuration for ES modules and Node.js targeting.

## Development Workflow

- **Build**: Run `npm run build` to compile TypeScript to `dist/index.js`.
- **Development**: Use `npm run dev` for live reloading with `tsx`.
- **Production**: Execute `npm start` to run the compiled server.
- **Testing**: No automated tests yet; manually test tools via MCP client integration.

## Tool Implementation Patterns

Tools follow this structure:
```typescript
server.tool(
  "tool_name",
  "Description of what the tool does",
  {
    param: z.string().describe("Parameter description"),
  },
  async ({ param }) => {
    // Tool logic using Playwright page
    return { content: [{ type: "text", text: "Result" }] };
  }
);
```

Examples from codebase:
- `navigate`: Launches browser if needed, navigates to URL.
- `click`: Clicks element by CSS selector.
- `type`: Fills input fields with text.
- `get_text`: Extracts text content from elements.

## Dependencies and Integration

- **MCP SDK**: Use `@modelcontextprotocol/sdk` for server setup and transport.
- **Playwright**: Import browsers like `chromium` for automation.
- **Zod**: Validate tool inputs with schemas.
- **Transport**: Stdio for local MCP client connections; extend to HTTP for remote access.

## Conventions

- Use async/await for all Playwright operations.
- Handle browser lifecycle: launch on first use, close on process exit.
- Error handling: Catch Playwright errors and return MCP error responses.
- Logging: Use `console.error` for server-side logs (avoid stdout for MCP compatibility).

## Common Patterns

- **Browser Initialization**: Check if `browser` exists before launching.
- **Selector Usage**: Prefer CSS selectors for element targeting.
- **Response Format**: Return text content in MCP tool results.
- **Cleanup**: Implement SIGINT handler for graceful browser shutdown.

For questions about MCP protocol or Playwright APIs, refer to official documentation. When adding new tools, ensure input validation and error handling match existing patterns.