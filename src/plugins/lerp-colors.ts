import builtInColors from 'tailwindcss/colors.js';
import type { DefaultColors } from 'tailwindcss/types/generated/colors.d.js';
import chroma, { InterpolationMode } from 'chroma-js';
import { entries, hasOwn, isNil, keys, shallowColors, type Colors, type Shades, type RawColors } from '../common.js';

// types for tailwind-lerp-colors
type Options = {
  includeBase?: boolean;
  includeLegacy?: boolean;
  lerpEnds?: boolean;
  interval?: number;
  mode?: InterpolationMode;
};
type OptionName = keyof Options;
type Option<T extends OptionName> = Options[T];
type SingularOptions = Pick<Options, 'lerpEnds' | 'interval' | 'mode'>;

// valid color modes for chroma-js
export const validColorModes: InterpolationMode[] = [
  'rgb',
  'lab',
  'lch',
  'lrgb',
  'hcl',
  'oklch',
  'hsi',
  'hsl',
  'hsv',
  'oklab',
] as const;

// default options for tailwind-lerp-colors -> lerpColor
const defaultSingleOptions: Required<SingularOptions> = {
  lerpEnds: true,
  interval: 25,
  mode: 'lrgb',
};

// default options for tailwind-lerp-colors -> lerpColors
const defaultOptions = {
  includeBase: true,
  includeLegacy: false,
  ...defaultSingleOptions,
};

const isObject = <T extends object = object>(x: any): x is T => {
  return x && typeof x === 'object' && !Array.isArray(x) && x.toString() === '[object Object]';
};

const isOptionInvalid = <T extends OptionName>(options: Options, optionName: T, test: (k: Option<T>) => boolean) => {
  return options && hasOwn(options, optionName) && !test(options[optionName]);
};

const throwError = (message: string) => {
  throw new Error(message);
};

const isValidShade = (shade: number | undefined): shade is number => {
  return !isNil(shade) && typeof shade === 'number' && !isNaN(shade) && shade >= 0;
};

export const lerpColor = (shades: Shades, options: SingularOptions = {}) => {
  // validate lerpEnds
  if (isOptionInvalid(options, 'lerpEnds', (v) => typeof v === 'boolean'))
    throwError('tailwind-lerp-colors option `lerpEnds` must be a boolean.');

  // validate interval
  if (isOptionInvalid(options, 'interval', (v) => Number.isInteger(v) && typeof v === 'number' && v > 0))
    throwError('tailwind-lerp-colors option `interval` must be a positive integer greater than 0.');

  // validate mode
  if (isOptionInvalid(options, 'mode', (v) => typeof v === 'string' && validColorModes.includes(v)))
    throwError(
      `tailwind-lerp-colors option \`mode\` must be one of the following values: ${validColorModes.join(', ')}.`
    );

  if (!isObject(shades))
    throwError(
      `tailwind-lerp-colors object \`shades\` must be an optionally-recursive object with numeric keys.\n\nvalue used: ${JSON.stringify(
        shades,
        null,
        2
      )}`
    );
  const { lerpEnds, interval, mode } = {
    ...defaultSingleOptions,
    ...(options ?? {}),
  };

  const sortByNumericFirstIndex = ([numericKeyA]: [number, string], [numericKeyB]: [number, string]) => {
    return numericKeyA - numericKeyB;
  };

  const namedShades: Record<string, string> = {};
  const numericShades = entries(shades)
    .flatMap(([key, color]) => {
      const numericShade = +key;
      if (isNaN(numericShade)) {
        namedShades[key] = color;
        return [];
      }
      return [[numericShade, chroma(color).hex()]] as [[number, string]];
    })
    .sort(sortByNumericFirstIndex);

  if (lerpEnds) {
    if (numericShades[0]?.[0] !== 0) numericShades.unshift([0, '#ffffff']);
    if (numericShades.slice(-1)[0]?.[0] !== 1000) numericShades.push([1000, '#000000']);
  }
  const finalShades = [...numericShades];
  for (let i = 0; i < numericShades.length - 1; i++) {
    const [shade, color] = numericShades[i] ?? [];
    const [nextShade, nextColor] = numericShades[i + 1] ?? [];
    if (!(isValidShade(shade) && color && nextShade && nextColor)) continue;

    // check to make sure both shades being compared
    // are evenly divisible by the set interval
    const interpolations = (nextShade - shade) / interval - 1;
    if (interpolations <= 0 || !Number.isInteger(interpolations)) continue;

    const scale = chroma.scale([color, nextColor]).mode(mode as InterpolationMode);
    const getColorAt = (percent: number) => scale(percent).hex();
    for (let run = 1; run <= interpolations; run++) {
      const percent = run / (interpolations + 1);
      finalShades.push([shade + interval * run, getColorAt(percent)]);
    }
  }
  finalShades.sort(sortByNumericFirstIndex);

  return {
    ...Object.fromEntries(finalShades),
    ...namedShades,
  };
};

export const lerpColors = (colors: RawColors | DefaultColors = {}, options: Options = {}): Colors => {
  // validate includeBase
  if (isOptionInvalid(options, 'includeBase', (v) => typeof v === 'boolean'))
    throwError('tailwind-lerp-colors option `includeBase` must be a boolean.');

  // validate includeLegacy
  if (isOptionInvalid(options, 'includeLegacy', (v) => typeof v === 'boolean'))
    throwError('tailwind-lerp-colors option `includeLegacy` must be a boolean.');

  const legacyNames = ['lightBlue', 'warmGray', 'trueGray', 'coolGray', 'blueGray'];

  const { includeBase, includeLegacy, lerpEnds, interval, mode } = {
    ...defaultOptions,
    ...options,
  };
  const baseColors: Colors = {};
  if (includeBase) {
    const builtInColorKeys = keys(builtInColors);
    for (const key of builtInColorKeys) {
      if (!legacyNames.includes(key) || includeLegacy) {
        baseColors[key] = builtInColors[key];
      }
    }
  }

  const initialColors = entries(
    shallowColors({
      ...baseColors,
      ...colors,
    })
  );

  const finalColors: Colors = {};

  for (const [name, shades] of initialColors) {
    if (typeof shades === 'string') {
      finalColors[name] = shades;
    } else {
      finalColors[name] = lerpColor(shades, { lerpEnds, interval, mode });
    }
  }

  return finalColors;
};
