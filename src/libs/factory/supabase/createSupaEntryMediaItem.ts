import { camelCaseToUnderscoreCase } from '../../utils/camelCaseToUnderscoreCase';
import { createSupaEntryMediaUrl } from './createSupaEntryMediaUrl';

export type CreateSupaEntryMediaItemProps = {
    item: any;
    volume?: string;
    sizes?: string[];
};

export const createSupaEntryMediaItem = ({ item, volume, sizes }: CreateSupaEntryMediaItemProps) => {
    let data = null;

    let baseUrl = process?.env?.S3_MEDIA_URI ?? '';
    if (volume) baseUrl += `/${volume}/`;

    if (item && item?.filename) {
        data = Object.assign(data ?? {}, {
            // src: item?.url,
            src: createSupaEntryMediaUrl({ base: baseUrl, filename: item?.filename }),
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
            const filename = item?.[`${handleDb}_filename` as any];

            if (filename) {
                tmp = Object.assign(tmp ?? {}, {
                    [handleSize]: {
                        // src: item?.[`${handleDb}_url` as any],
                        src: createSupaEntryMediaUrl({ base: baseUrl, filename }),
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
