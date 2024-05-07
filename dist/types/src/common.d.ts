export declare const EMPTY_VALUES: {
    values: {
        DEFAULT: string;
    };
};
export declare function keys<T extends object>(obj: T): (keyof T)[];
export type ObjectKey = string | number | symbol;
export declare function entries<K extends ObjectKey, V>(o: Record<K, V>): [K, V][];
export declare function entries<K, V>(o: Map<K, V>): [K, V][];
export declare function fromEntries<K extends ObjectKey, V>(entries: [K, V][] | Map<K, V>): Record<K, V>;
export declare function hasOwn<T extends object>(obj: T, key: keyof T): key is keyof T;
export interface RecursiveKeyValuePair<K extends keyof any = string, V = string> {
    [key: string]: V | RecursiveKeyValuePair<K, V>;
}
export type Shades = Record<string, string>;
export type Colors = Record<string, string | Shades>;
export type RawColors = RecursiveKeyValuePair;
export declare function shallowColors(colors: RawColors, keys?: (string | number)[], memo?: Colors): Colors;
export declare const isNil: (x: any) => x is null | undefined;
