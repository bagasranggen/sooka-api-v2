export type CreateSupaRelatedEntryLinkItemProps = {
    item?: { id: number; title: string; url: string };
};

export const createSupaRelatedEntryLinkItem = ({ item }: CreateSupaRelatedEntryLinkItemProps) => {
    let data = null;

    if (item) {
        data = {
            url: item.url,
            title: item.title,
        };
    }

    return data;
};
