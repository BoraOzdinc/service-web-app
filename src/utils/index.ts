import { z } from "zod";



export function extractData(str: string) {
    const startIndex = str.indexOf("[{");
    const endIndex = str.lastIndexOf("}]") + 2;
    const jsonStr = str.substring(startIndex, endIndex);
    return jsonStr;
}

export const isValidEmail = (email: string | undefined) => {
    try {
        z.string().email().parse(email);
        return false;
    } catch (error) {
        return true;
    }
};
