export interface Color {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export const PALETTE: Record<string, Color> = {
  transparent: { r: 0, g: 0, b: 0, a: 0 },
  black: { r: 0, g: 0, b: 0 },
  white: { r: 255, g: 255, b: 255 },
  red: { r: 255, g: 0, b: 0 },
  green: { r: 0, g: 255, b: 0 },
  blue: { r: 0, g: 0, b: 255 },
  yellow: { r: 255, g: 255, b: 0 },
  cyan: { r: 0, g: 255, b: 255 },
  magenta: { r: 255, g: 0, b: 255 },
  gray: { r: 128, g: 128, b: 128 },
  darkgray: { r: 64, g: 64, b: 64 },
  lightgray: { r: 192, g: 192, b: 192 },
  orange: { r: 255, g: 165, b: 0 },
  purple: { r: 128, g: 0, b: 128 },
  brown: { r: 165, g: 42, b: 42 },
  pink: { r: 255, g: 192, b: 203 }
};

export function parseColor(colorInput: string | Color): Color {
  if (typeof colorInput === 'object') {
    return colorInput;
  }
  
  const colorName = colorInput.toLowerCase();
  if (PALETTE[colorName]) {
    return PALETTE[colorName];
  }
  
  if (colorInput.startsWith('#')) {
    const hex = colorInput.slice(1);
    if (hex.length === 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16)
      };
    }
  }
  
  throw new Error(`Invalid color: ${colorInput}`);
}

export function colorToHex(color: Color): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
}