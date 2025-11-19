export const camelCaseToUnderscoreCase = (string: string) => {
    return string
        .replace(/(?:^|\.?)([A-Z])/g, function (x, y) {
            return '_' + y.toLowerCase();
        })
        .replace(/^_/, '');
};
