export const tools = [
    {
        name: 'create_canvas',
        description: 'Create a new pixel art canvas with specified dimensions',
        inputSchema: {
            type: 'object',
            properties: {
                width: {
                    type: 'number',
                    description: 'Canvas width in pixels (1-1000)',
                    minimum: 1,
                    maximum: 1000
                },
                height: {
                    type: 'number',
                    description: 'Canvas height in pixels (1-1000)',
                    minimum: 1,
                    maximum: 1000
                },
                name: {
                    type: 'string',
                    description: 'Optional name for the canvas (defaults to "default")'
                }
            },
            required: ['width', 'height']
        }
    },
    {
        name: 'set_pixel',
        description: 'Set a single pixel to a specific color',
        inputSchema: {
            type: 'object',
            properties: {
                canvas_name: {
                    type: 'string',
                    description: 'Name of the canvas (defaults to "default")'
                },
                x: {
                    type: 'number',
                    description: 'X coordinate of the pixel'
                },
                y: {
                    type: 'number',
                    description: 'Y coordinate of the pixel'
                },
                color: {
                    type: 'string',
                    description: 'Color name (e.g. "red", "blue") or hex code (e.g. "#FF0000")'
                }
            },
            required: ['x', 'y', 'color']
        }
    },
    {
        name: 'draw_line',
        description: 'Draw a line between two points',
        inputSchema: {
            type: 'object',
            properties: {
                canvas_name: {
                    type: 'string',
                    description: 'Name of the canvas (defaults to "default")'
                },
                x1: {
                    type: 'number',
                    description: 'Starting X coordinate'
                },
                y1: {
                    type: 'number',
                    description: 'Starting Y coordinate'
                },
                x2: {
                    type: 'number',
                    description: 'Ending X coordinate'
                },
                y2: {
                    type: 'number',
                    description: 'Ending Y coordinate'
                },
                color: {
                    type: 'string',
                    description: 'Line color'
                }
            },
            required: ['x1', 'y1', 'x2', 'y2', 'color']
        }
    },
    {
        name: 'draw_rectangle',
        description: 'Draw a rectangle (outline or filled)',
        inputSchema: {
            type: 'object',
            properties: {
                canvas_name: {
                    type: 'string',
                    description: 'Name of the canvas (defaults to "default")'
                },
                x: {
                    type: 'number',
                    description: 'Top-left X coordinate'
                },
                y: {
                    type: 'number',
                    description: 'Top-left Y coordinate'
                },
                width: {
                    type: 'number',
                    description: 'Rectangle width'
                },
                height: {
                    type: 'number',
                    description: 'Rectangle height'
                },
                color: {
                    type: 'string',
                    description: 'Rectangle color'
                },
                filled: {
                    type: 'boolean',
                    description: 'Whether to fill the rectangle (default: false)',
                    default: false
                }
            },
            required: ['x', 'y', 'width', 'height', 'color']
        }
    },
    {
        name: 'flood_fill',
        description: 'Fill an area with a color (bucket fill)',
        inputSchema: {
            type: 'object',
            properties: {
                canvas_name: {
                    type: 'string',
                    description: 'Name of the canvas (defaults to "default")'
                },
                x: {
                    type: 'number',
                    description: 'Starting X coordinate for fill'
                },
                y: {
                    type: 'number',
                    description: 'Starting Y coordinate for fill'
                },
                color: {
                    type: 'string',
                    description: 'Fill color'
                }
            },
            required: ['x', 'y', 'color']
        }
    },
    {
        name: 'clear_canvas',
        description: 'Clear the entire canvas with a color',
        inputSchema: {
            type: 'object',
            properties: {
                canvas_name: {
                    type: 'string',
                    description: 'Name of the canvas (defaults to "default")'
                },
                color: {
                    type: 'string',
                    description: 'Clear color (default: "transparent")',
                    default: 'transparent'
                }
            },
            required: []
        }
    },
    {
        name: 'save_image',
        description: 'Save the canvas as PNG or JSON file',
        inputSchema: {
            type: 'object',
            properties: {
                canvas_name: {
                    type: 'string',
                    description: 'Name of the canvas (defaults to "default")'
                },
                filename: {
                    type: 'string',
                    description: 'Output filename'
                },
                format: {
                    type: 'string',
                    enum: ['png', 'json'],
                    description: 'Output format (default: "png")',
                    default: 'png'
                }
            },
            required: ['filename']
        }
    },
    {
        name: 'load_image',
        description: 'Load a canvas from JSON file',
        inputSchema: {
            type: 'object',
            properties: {
                filename: {
                    type: 'string',
                    description: 'JSON file to load'
                },
                canvas_name: {
                    type: 'string',
                    description: 'Name for the loaded canvas (defaults to "default")'
                }
            },
            required: ['filename']
        }
    },
    {
        name: 'get_canvas_info',
        description: 'Get information about the current canvas and preview',
        inputSchema: {
            type: 'object',
            properties: {
                canvas_name: {
                    type: 'string',
                    description: 'Name of the canvas (defaults to "default")'
                }
            },
            required: []
        }
    },
    {
        name: 'list_colors',
        description: 'List all available predefined colors',
        inputSchema: {
            type: 'object',
            properties: {},
            required: []
        }
    }
];
