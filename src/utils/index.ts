


export function extractData(str: string) {
    const startIndex = str.indexOf("[{");
    const endIndex = str.lastIndexOf("}]") + 2;
    const jsonStr = str.substring(startIndex, endIndex);
    return jsonStr;
}

