import { parseColor, PALETTE } from './colors.js';
import { createCanvas } from 'canvas';
import fs from 'fs';
export class PixelCanvas {
    pixels;
    width;
    height;
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.pixels = Array(height).fill(null).map(() => Array(width).fill(null).map(() => ({ ...PALETTE.transparent })));
    }
    getWidth() {
        return this.width;
    }
    getHeight() {
        return this.height;
    }
    setPixel(x, y, color) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            throw new Error(`Pixel coordinates (${x}, ${y}) out of bounds`);
        }
        this.pixels[y][x] = parseColor(color);
    }
    getPixel(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            throw new Error(`Pixel coordinates (${x}, ${y}) out of bounds`);
        }
        return { ...this.pixels[y][x] };
    }
    clear(color = 'transparent') {
        const clearColor = parseColor(color);
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.pixels[y][x] = { ...clearColor };
            }
        }
    }
    drawLine(x1, y1, x2, y2, color) {
        const plotColor = parseColor(color);
        const dx = Math.abs(x2 - x1);
        const dy = Math.abs(y2 - y1);
        const sx = x1 < x2 ? 1 : -1;
        const sy = y1 < y2 ? 1 : -1;
        let err = dx - dy;
        let currentX = x1;
        let currentY = y1;
        while (true) {
            if (currentX >= 0 && currentX < this.width && currentY >= 0 && currentY < this.height) {
                this.pixels[currentY][currentX] = { ...plotColor };
            }
            if (currentX === x2 && currentY === y2)
                break;
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                currentX += sx;
            }
            if (e2 < dx) {
                err += dx;
                currentY += sy;
            }
        }
    }
    drawRectangle(x, y, width, height, color, filled = false) {
        const plotColor = parseColor(color);
        if (filled) {
            for (let py = y; py < y + height; py++) {
                for (let px = x; px < x + width; px++) {
                    if (px >= 0 && px < this.width && py >= 0 && py < this.height) {
                        this.pixels[py][px] = { ...plotColor };
                    }
                }
            }
        }
        else {
            this.drawLine(x, y, x + width - 1, y, color);
            this.drawLine(x, y, x, y + height - 1, color);
            this.drawLine(x + width - 1, y, x + width - 1, y + height - 1, color);
            this.drawLine(x, y + height - 1, x + width - 1, y + height - 1, color);
        }
    }
    floodFill(x, y, newColor) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return;
        }
        const targetColor = this.getPixel(x, y);
        const fillColor = parseColor(newColor);
        if (this.colorsEqual(targetColor, fillColor)) {
            return;
        }
        const stack = [[x, y]];
        while (stack.length > 0) {
            const [currentX, currentY] = stack.pop();
            if (currentX < 0 || currentX >= this.width ||
                currentY < 0 || currentY >= this.height) {
                continue;
            }
            if (!this.colorsEqual(this.getPixel(currentX, currentY), targetColor)) {
                continue;
            }
            this.pixels[currentY][currentX] = { ...fillColor };
            stack.push([currentX + 1, currentY]);
            stack.push([currentX - 1, currentY]);
            stack.push([currentX, currentY + 1]);
            stack.push([currentX, currentY - 1]);
        }
    }
    colorsEqual(c1, c2) {
        return c1.r === c2.r && c1.g === c2.g && c1.b === c2.b && (c1.a || 255) === (c2.a || 255);
    }
    saveAsPNG(filename) {
        const canvas = createCanvas(this.width, this.height);
        const ctx = canvas.getContext('2d');
        const imageData = ctx.createImageData(this.width, this.height);
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const pixel = this.pixels[y][x];
                const index = (y * this.width + x) * 4;
                imageData.data[index] = pixel.r;
                imageData.data[index + 1] = pixel.g;
                imageData.data[index + 2] = pixel.b;
                imageData.data[index + 3] = pixel.a !== undefined ? pixel.a : 255;
            }
        }
        ctx.putImageData(imageData, 0, 0);
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(filename, buffer);
    }
    saveAsJSON(filename) {
        const data = {
            width: this.width,
            height: this.height,
            pixels: this.pixels
        };
        fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    }
    static loadFromJSON(filename) {
        const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
        const canvas = new PixelCanvas(data.width, data.height);
        canvas.pixels = data.pixels;
        return canvas;
    }
    getPreview() {
        let preview = `Canvas ${this.width}x${this.height}:\n`;
        for (let y = 0; y < Math.min(this.height, 16); y++) {
            let row = '';
            for (let x = 0; x < Math.min(this.width, 32); x++) {
                const pixel = this.pixels[y][x];
                if (pixel.a === 0) {
                    row += ' ';
                }
                else if (pixel.r + pixel.g + pixel.b < 384) {
                    row += '█';
                }
                else {
                    row += '░';
                }
            }
            preview += row + '\n';
        }
        return preview;
    }
}
