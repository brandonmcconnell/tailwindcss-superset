import { type Colors, type RawColors } from '../common.js';
import type { DefaultColors } from 'tailwindcss/types/generated/colors.d.js';
type GranularShadeDefault = Record<string, string | number>;
type ShadeDefault = number | string | GranularShadeDefault;
export declare function defaultShades(rawColors: RawColors | DefaultColors, defaultShade?: ShadeDefault): Colors;
export {};
