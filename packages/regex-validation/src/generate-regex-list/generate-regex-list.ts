export function generateRegexList(regexObject: object): object {
    return Object.assign(
        {},
        ...(function _flatten(o): object[] {
            return ([] as object[]).concat(
                ...Object.keys(o).map((k): object => (typeof o[k] === 'object' ? _flatten(o[k]) : { [k]: o[k] })),
            );
        })(regexObject),
    );
}
