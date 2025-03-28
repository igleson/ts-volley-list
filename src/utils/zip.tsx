export function zip<T extends unknown[][]>(
    ...args: T
): { [K in keyof T]: T[K] extends (infer V)[] ? V : never }[] {
    const minLength = Math.min(...args.map((arr) => arr.length));
    // @ts-expect-error This is too much for ts
    return [...Array(minLength).keys()].map((i) => args.map((arr) => arr[i]));
}