import { camelCaseToUnderscoreCase } from '../../utils/camelCaseToUnderscoreCase';

export type CreateSupaEntryMediaItemProps = {
    item: any;
    sizes?: string[];
};

export const createSupaEntryMediaItem = ({ item, sizes }: CreateSupaEntryMediaItemProps) => {
    let data = null;

    if (item && item?.url) {
        data = Object.assign(data ?? {}, {
            src: item?.url,
            width: item?.width,
            height: item?.height,
            filename: item?.filename,
            alt: item?.alt,
        });
    }

    if (item && sizes && sizes.length > 0) {
        let tmp: any = undefined;

        sizes.forEach((handleSize) => {
            const handle = camelCaseToUnderscoreCase(handleSize);
            const handleDb = `sizes_${handle}`;

            if (item?.[`${handleDb}_url` as any]) {
                tmp = Object.assign(tmp ?? {}, {
                    [handleSize]: {
                        src: item?.[`${handleDb}_url` as any],
                        width: item?.[`${handleDb}_width` as any],
                        height: item?.[`${handleDb}_height` as any],
                    },
                });
            }
        });

        if (tmp) data = Object.assign(data ?? {}, { sizes: tmp });
    }

    return data;
};
