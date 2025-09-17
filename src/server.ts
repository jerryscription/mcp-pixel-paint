#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { PixelCanvas } from './canvas.js';
import { PALETTE } from './colors.js';
import { tools } from './tools.js';
import {
  CreateCanvasSchema,
  SetPixelSchema,
  DrawLineSchema,
  DrawRectangleSchema,
  FloodFillSchema,
  SaveImageSchema,
  LoadImageSchema,
  GetCanvasInfoSchema,
  ClearCanvasSchema,
  ListColorsSchema,
  CreateCanvasArgs,
  SetPixelArgs,
  DrawLineArgs,
  DrawRectangleArgs,
  FloodFillArgs,
  SaveImageArgs,
  LoadImageArgs,
  GetCanvasInfoArgs,
  ClearCanvasArgs,
  ListColorsArgs
} from './schemas.js';

class PixelPaintServer {
  private server: Server;
  private canvases: Map<string, PixelCanvas> = new Map();

  constructor() {
    this.server = new Server(
      {
        name: 'mcp-pixel-paint',
        version: '1.0.0',
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
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools,
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'create_canvas':
            return await this.handleCreateCanvas(CreateCanvasSchema.parse(args));
          
          case 'set_pixel':
            return await this.handleSetPixel(SetPixelSchema.parse(args));
          
          case 'draw_line':
            return await this.handleDrawLine(DrawLineSchema.parse(args));
          
          case 'draw_rectangle':
            return await this.handleDrawRectangle(DrawRectangleSchema.parse(args));
          
          case 'flood_fill':
            return await this.handleFloodFill(FloodFillSchema.parse(args));
          
          case 'clear_canvas':
            return await this.handleClearCanvas(ClearCanvasSchema.parse(args));
          
          case 'save_image':
            return await this.handleSaveImage(SaveImageSchema.parse(args));
          
          case 'load_image':
            return await this.handleLoadImage(LoadImageSchema.parse(args));
          
          case 'get_canvas_info':
            return await this.handleGetCanvasInfo(GetCanvasInfoSchema.parse(args));
          
          case 'list_colors':
            return await this.handleListColors(ListColorsSchema.parse(args));
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
        };
      }
    });
  }

  private getCanvas(name?: string): PixelCanvas {
    const canvasName = name || 'default';
    const canvas = this.canvases.get(canvasName);
    if (!canvas) {
      throw new Error(`Canvas "${canvasName}" not found. Create it first with create_canvas.`);
    }
    return canvas;
  }

  private async handleCreateCanvas(args: CreateCanvasArgs) {
    const canvasName = args.name || 'default';
    const canvas = new PixelCanvas(args.width, args.height);
    this.canvases.set(canvasName, canvas);
    
    return {
      content: [
        {
          type: 'text',
          text: `Created canvas "${canvasName}" with dimensions ${args.width}x${args.height}`,
        },
      ],
    };
  }

  private async handleSetPixel(args: SetPixelArgs) {
    const canvas = this.getCanvas(args.canvas_name);
    canvas.setPixel(args.x, args.y, args.color);
    
    return {
      content: [
        {
          type: 'text',
          text: `Set pixel at (${args.x}, ${args.y}) to ${args.color}`,
        },
      ],
    };
  }

  private async handleDrawLine(args: DrawLineArgs) {
    const canvas = this.getCanvas(args.canvas_name);
    canvas.drawLine(args.x1, args.y1, args.x2, args.y2, args.color);
    
    return {
      content: [
        {
          type: 'text',
          text: `Drew line from (${args.x1}, ${args.y1}) to (${args.x2}, ${args.y2}) in ${args.color}`,
        },
      ],
    };
  }

  private async handleDrawRectangle(args: DrawRectangleArgs) {
    const canvas = this.getCanvas(args.canvas_name);
    canvas.drawRectangle(args.x, args.y, args.width, args.height, args.color, args.filled);
    
    const fillType = args.filled ? 'filled' : 'outline';
    return {
      content: [
        {
          type: 'text',
          text: `Drew ${fillType} rectangle at (${args.x}, ${args.y}) size ${args.width}x${args.height} in ${args.color}`,
        },
      ],
    };
  }

  private async handleFloodFill(args: FloodFillArgs) {
    const canvas = this.getCanvas(args.canvas_name);
    canvas.floodFill(args.x, args.y, args.color);
    
    return {
      content: [
        {
          type: 'text',
          text: `Flood filled area starting at (${args.x}, ${args.y}) with ${args.color}`,
        },
      ],
    };
  }

  private async handleClearCanvas(args: ClearCanvasArgs) {
    const canvas = this.getCanvas(args.canvas_name);
    canvas.clear(args.color);
    
    return {
      content: [
        {
          type: 'text',
          text: `Cleared canvas with ${args.color}`,
        },
      ],
    };
  }

  private async handleSaveImage(args: SaveImageArgs) {
    const canvas = this.getCanvas(args.canvas_name);
    
    if (args.format === 'json') {
      canvas.saveAsJSON(args.filename);
    } else {
      canvas.saveAsPNG(args.filename);
    }
    
    return {
      content: [
        {
          type: 'text',
          text: `Saved canvas as ${args.format.toUpperCase()} to ${args.filename}`,
        },
      ],
    };
  }

  private async handleLoadImage(args: LoadImageArgs) {
    const canvasName = args.canvas_name || 'default';
    
    try {
      const canvas = PixelCanvas.loadFromJSON(args.filename);
      this.canvases.set(canvasName, canvas);
      
      return {
        content: [
          {
            type: 'text',
            text: `Loaded canvas from ${args.filename} as "${canvasName}"`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to load canvas: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async handleGetCanvasInfo(args: GetCanvasInfoArgs) {
    const canvas = this.getCanvas(args.canvas_name);
    const preview = canvas.getPreview();
    
    return {
      content: [
        {
          type: 'text',
          text: `Canvas dimensions: ${canvas.getWidth()}x${canvas.getHeight()}\n\n${preview}`,
        },
      ],
    };
  }

  private async handleListColors(args: ListColorsArgs) {
    const colorList = Object.keys(PALETTE).map(name => {
      const color = PALETTE[name];
      const hex = `#${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`;
      return `${name}: ${hex}${color.a !== undefined && color.a < 255 ? ` (alpha: ${color.a})` : ''}`;
    }).join('\n');
    
    return {
      content: [
        {
          type: 'text',
          text: `Available colors:\n${colorList}\n\nYou can also use hex codes like #FF0000 for custom colors.`,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    console.error('MCP Pixel Paint Server running on stdio');
  }
}

const server = new PixelPaintServer();
server.run().catch(console.error);