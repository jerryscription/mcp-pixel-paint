# MCP Pixel Paint

A Model Context Protocol (MCP) server that allows LLMs to create pixel art through natural language commands in Claude Code.

## Features

- **Canvas Management**: Create canvases of any size (up to 1000x1000)
- **Drawing Tools**: Pixels, lines, rectangles, flood fill
- **Color System**: 16 predefined colors + custom hex colors
- **File Operations**: Save as PNG images or JSON data
- **Multiple Canvases**: Work with multiple named canvases simultaneously

## Installation

```bash
npm install
npm run build
```

## Usage

### As MCP Server

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "pixel-paint": {
      "command": "node",
      "args": ["/path/to/mcp-pixel-paint/dist/server.js"]
    }
  }
}
```

### Development

```bash
npm run dev
```

## Available Tools

### Canvas Management

- `create_canvas(width, height, name?)` - Create new canvas
- `get_canvas_info(canvas_name?)` - View canvas info and preview  
- `clear_canvas(canvas_name?, color?)` - Clear canvas with color

### Drawing Tools

- `set_pixel(x, y, color, canvas_name?)` - Set single pixel
- `draw_line(x1, y1, x2, y2, color, canvas_name?)` - Draw line
- `draw_rectangle(x, y, width, height, color, filled?, canvas_name?)` - Draw rectangle
- `flood_fill(x, y, color, canvas_name?)` - Fill area with color

### File Operations

- `save_image(filename, format?, canvas_name?)` - Save as PNG or JSON
- `load_image(filename, canvas_name?)` - Load from JSON file

### Colors

- `list_colors()` - Show available colors

**Predefined Colors:**
transparent, black, white, red, green, blue, yellow, cyan, magenta, gray, darkgray, lightgray, orange, purple, brown, pink

**Custom Colors:** Use hex format like `#FF0000`

## Example Commands

```
# Create a 32x32 canvas
create_canvas(32, 32, "my_art")

# Draw a red smiley face
set_pixel(10, 10, "red", "my_art")     # left eye
set_pixel(22, 10, "red", "my_art")     # right eye
draw_line(8, 20, 24, 20, "red", "my_art")  # smile

# Save as PNG
save_image("smiley.png", "png", "my_art")
```

## Development

The server uses:
- TypeScript for type safety
- Zod for input validation
- node-canvas for PNG generation
- MCP SDK for protocol implementation

## License

MIT