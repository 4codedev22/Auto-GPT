import {
    Transform,
    TransformFnParams,
    TransformOptions,
} from "class-transformer";



export interface TrimOptions {
    /** @default 'both' */
    strategy?: "start" | "end" | "both";
}
export interface ReplaceOptions {
    /** @default 'both' */
    strategy?: "start" | "end" | "both";
}

export const Trim = (
    options?: TrimOptions,
    transformOptions?: TransformOptions
): (target: any, key: string) => void => {
    return Transform((sourceData: TransformFnParams) => {
        if ("string" !== typeof sourceData?.value) {
            return sourceData?.value;
        }

        switch (options?.strategy) {
            case "start":
                return sourceData.value.trimStart();
            case "end":
                return sourceData.value.trimEnd();
            default:
                return sourceData.value.trim();
        }
    }, transformOptions);
}


export const OnlyNumbers = (
    transformOptions?: TransformOptions
): (target: any, key: string) => void => {
    return Transform(({ value }: TransformFnParams) => {
        if ("string" !== typeof value) {
            return value;
        }
        return value?.replace(/\D+/g, '');
    }, transformOptions);
}