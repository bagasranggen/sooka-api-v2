import { camelCaseToUnderscoreCase } from '../../utils/camelCaseToUnderscoreCase';

export type CreateSupaEntryMediaProps = {
    items: any[];
    id: string;
    sizes?: string[];
};

export const createSupaEntryMedia = ({ items, id, sizes }: CreateSupaEntryMediaProps) => {
    let data = null;
    let mediaItem = undefined;

    if (id && items && items.length > 0) {
        const tmp = items.find((item) => item.id === id);

        if (tmp) mediaItem = tmp;
    }

    if (mediaItem && mediaItem?.url) {
        data = Object.assign(data ?? {}, {
            src: mediaItem?.url,
            width: mediaItem?.width,
            height: mediaItem?.height,
            filename: mediaItem?.filename,
            alt: mediaItem?.alt,
        });
    }

    if (mediaItem && sizes && sizes.length > 0) {
        let tmp: any = undefined;

        sizes.forEach((item) => {
            const handle = camelCaseToUnderscoreCase(item);
            const handleDb = `sizes_${handle}`;

            if (mediaItem?.[`${handleDb}_url` as any]) {
                tmp = Object.assign(tmp ?? {}, {
                    [item]: {
                        src: mediaItem?.[`${handleDb}_url` as any],
                        width: mediaItem?.[`${handleDb}_width` as any],
                        height: mediaItem?.[`${handleDb}_height` as any],
                    },
                });
            }
        });

        if (tmp) data = Object.assign(data ?? {}, { sizes: tmp });
    }

    return data;
};
