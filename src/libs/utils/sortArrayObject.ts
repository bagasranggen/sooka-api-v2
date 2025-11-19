export const sortArrayObject = ({ items, key }: { items: any[]; key: string }) => {
    return items.sort((a, b) => a[key] - b[key]);
};
