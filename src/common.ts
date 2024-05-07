// this adds support for using a variant or utility without specifying a value, primarily for magic 🪄
export const EMPTY_VALUES = { values: { DEFAULT: '' } };

export function keys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

export type ObjectKey = string | number | symbol;

// Get entries (array of [key, value] arrays) of object (strongly-typed)
export function entries<K extends ObjectKey, V>(o: Record<K, V>): [K, V][];
export function entries<K, V>(o: Map<K, V>): [K, V][];
export function entries<K extends ObjectKey, V>(o: Record<K, V> | Map<K, V>): [K, V][] {
  if (o instanceof Map) return Array.from(o.entries()) as unknown as [K, V][];
  return Object.entries(o) as unknown as [K, V][];
}

export function fromEntries<K extends ObjectKey, V>(entries: [K, V][] | Map<K, V>): Record<K, V> {
  return Object.fromEntries(entries) as Record<K, V>;
}

export function hasOwn<T extends object>(obj: T, key: keyof T): key is keyof T {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

export interface RecursiveKeyValuePair<K extends keyof any = string, V = string> {
  [key: string]: V | RecursiveKeyValuePair<K, V>;
}

export type Shades = Record<string, string>;
export type Colors = Record<string, string | Shades>;
export type RawColors = RecursiveKeyValuePair;

export function shallowColors(colors: RawColors, keys: (string | number)[] = [], memo: Colors = {}) {
  return entries(colors).reduce((memo, [key, value]) => {
    if (typeof value === 'string') {
      const shades = (keys.length ? (memo[keys.join('-')] ??= {}) : memo) as Shades;
      shades[key] = value;
    } else {
      shallowColors(value, [...keys, key], memo);
    }
    return memo;
  }, memo);
}

export const isNil = (x: any): x is null | undefined => x === null || x === undefined;
