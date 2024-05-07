import type { DefaultColors } from 'tailwindcss/types/generated/colors.d.js';
import { InterpolationMode } from 'chroma-js';
import { type Colors, type Shades, type RawColors } from '../common.js';
type Options = {
    includeBase?: boolean;
    includeLegacy?: boolean;
    lerpEnds?: boolean;
    interval?: number;
    mode?: InterpolationMode;
};
type SingularOptions = Pick<Options, 'lerpEnds' | 'interval' | 'mode'>;
export declare const validColorModes: InterpolationMode[];
export declare const lerpColor: (shades: Shades, options?: SingularOptions) => {
    [x: string]: string;
};
export declare const lerpColors: (colors?: RawColors | DefaultColors, options?: Options) => Colors;
export {};
