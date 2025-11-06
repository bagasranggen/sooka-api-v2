export type CreateSupaRelatedEntryLinkProps = {
    items?: { id: number; title: string; url: string }[];
    id?: number;
};

export const createSupaRelatedEntryLink = ({ items, id }: CreateSupaRelatedEntryLinkProps) => {
    let data = null;

    if (items && items.length > 0 && id) {
        const tmp = items.find((item) => item.id === id);

        if (tmp) data = { url: tmp.url, title: tmp.title };
    }

    return data;
};
