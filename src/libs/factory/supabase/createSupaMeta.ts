export const createSupaMeta = ({ item }: { item?: any }) => {
    let data = undefined;

    if (item && item?.meta_title) data = Object.assign(data ?? {}, { title: item.meta_title });
    if (item && item?.meta_description) data = Object.assign(data ?? {}, { description: item.meta_description });

    return data;
};
