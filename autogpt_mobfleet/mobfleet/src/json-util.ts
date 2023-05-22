export const parse = (text: string, onFail?: () => any, reviver?: (this: any, key: string, value: any) => any): any => {
    try {
        return JSON.parse(text, reviver);
    } catch (error) {
        return onFail?.();
    }
};

export const parseOrSameValue = (text: string): any => {
    try {
        return JSON.parse(text);
    } catch (error) {
        return text;
    }
};
