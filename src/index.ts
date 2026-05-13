import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError } from "@modelcontextprotocol/sdk/types.js";
import { chromium } from "playwright";

class PlaywrightMCPServer {
  private server: Server;
  private browser: any;
  private page: any;

  constructor() {
    this.server = new Server(
      {
        name: "playwright-mcp",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "navigate",
            description: "Navigate to a URL",
            inputSchema: {
              type: "object",
              properties: {
                url: { type: "string", description: "The URL to navigate to" },
              },
              required: ["url"],
            },
          },
          {
            name: "click",
            description: "Click on an element by selector",
            inputSchema: {
              type: "object",
              properties: {
                selector: { type: "string", description: "CSS selector of the element to click" },
              },
              required: ["selector"],
            },
          },
          {
            name: "type",
            description: "Type text into an element",
            inputSchema: {
              type: "object",
              properties: {
                selector: { type: "string", description: "CSS selector of the input element" },
                text: { type: "string", description: "Text to type" },
              },
              required: ["selector", "text"],
            },
          },
          {
            name: "get_text",
            description: "Get text content of an element",
            inputSchema: {
              type: "object",
              properties: {
                selector: { type: "string", description: "CSS selector of the element" },
              },
              required: ["selector"],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: rawArgs } = request.params;
      const args = rawArgs as { url?: string; selector?: string; text?: string } | undefined;

      if (!args) {
        throw new McpError(ErrorCode.InvalidParams, "Tool arguments are required.");
      }

      try {
        switch (name) {
          case "navigate":
            if (!args.url) {
              throw new McpError(ErrorCode.InvalidParams, "The 'url' argument is required.");
            }
            if (!this.browser) {
              this.browser = await chromium.launch();
              this.page = await this.browser.newPage();
            }
            await this.page.goto(args.url);
            return { content: [{ type: "text", text: `Navigated to ${args.url}` }] };

          case "click":
            if (!args.selector) {
              throw new McpError(ErrorCode.InvalidParams, "The 'selector' argument is required.");
            }
            await this.page.click(args.selector);
            return { content: [{ type: "text", text: `Clicked on ${args.selector}` }] };

          case "type":
            if (!args.selector || args.text === undefined) {
              throw new McpError(ErrorCode.InvalidParams, "Both 'selector' and 'text' arguments are required.");
            }
            await this.page.fill(args.selector, args.text);
            return { content: [{ type: "text", text: `Typed "${args.text}" into ${args.selector}` }] };

          case "get_text":
            if (!args.selector) {
              throw new McpError(ErrorCode.InvalidParams, "The 'selector' argument is required.");
            }
            const text = await this.page.textContent(args.selector);
            return { content: [{ type: "text", text: text || "" }] };

          default:
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${message}`);
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Playwright MCP server running on stdio");
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

const server = new PlaywrightMCPServer();

process.on("SIGINT", async () => {
  await server.cleanup();
  process.exit(0);
});

server.run().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});