/** Can be used in switch's default case to enforce exhaustiveness (prevents you from missing some case). */
export function checkExhaustiveness(arg: never, message: string | null = null): never {
    throw new Error(
        message ||
        `Exhaustive check failed for: ${arg}. Possible reason: you didn't cover all cases in 'switch' statement`,
    );
}
