let isObject = (val: any) => typeof val === 'object' && typeof val !== null;

let i18nRe = /\$t\(('|")([^'"]+)\1\)/g;

let isUndef = (val: any) => val === undefined;

function escapeSpecialCharacter(str: String) {
    const pattern = /[\^.\-\+\\\$\(\)\*\[\]\?\{\}\|\?]/g;
    return str.replace(pattern, match => '\\' + match);
}

function stripBOM(content: string) {
    if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
    }
    return content;
}

function getValByPath(key: string, source: Object, defaultVal?: string): string | undefined {
    let arr = key.split('.');
    let tempObj = (source as any)[stripBOM(arr.shift()!)];
    while (arr.length) {
        if (!tempObj) { break; };
        tempObj = tempObj[stripBOM(arr.shift()!)];
    }
    return isUndef(tempObj) ? defaultVal : tempObj;
}

function debounce(fn: Function, delay = 50) {
    let timer: NodeJS.Timeout | null = null;
    return function (this: any, ...args: any[]) {
        if (timer) { clearTimeout(timer); };
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

module.exports = {
    isObject,
    i18nRe,
    getValByPath,
    debounce
};