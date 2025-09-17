import { z } from 'zod';
export const CreateCanvasSchema = z.object({
    width: z.number().min(1).max(1000),
    height: z.number().min(1).max(1000),
    name: z.string().optional()
});
export const SetPixelSchema = z.object({
    canvas_name: z.string().optional(),
    x: z.number(),
    y: z.number(),
    color: z.string()
});
export const DrawLineSchema = z.object({
    canvas_name: z.string().optional(),
    x1: z.number(),
    y1: z.number(),
    x2: z.number(),
    y2: z.number(),
    color: z.string()
});
export const DrawRectangleSchema = z.object({
    canvas_name: z.string().optional(),
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
    color: z.string(),
    filled: z.boolean().optional().default(false)
});
export const FloodFillSchema = z.object({
    canvas_name: z.string().optional(),
    x: z.number(),
    y: z.number(),
    color: z.string()
});
export const SaveImageSchema = z.object({
    canvas_name: z.string().optional(),
    filename: z.string(),
    format: z.enum(['png', 'json']).default('png')
});
export const LoadImageSchema = z.object({
    filename: z.string(),
    canvas_name: z.string().optional()
});
export const GetCanvasInfoSchema = z.object({
    canvas_name: z.string().optional()
});
export const ClearCanvasSchema = z.object({
    canvas_name: z.string().optional(),
    color: z.string().optional().default('transparent')
});
export const ListColorsSchema = z.object({});
