import { cookies } from 'next/headers';

import { supabase } from '@/libs/fetcher';
import { camelCaseToUnderscoreCase } from '../../utils/camelCaseToUnderscoreCase';
import { createSupaEntryMediaUrl } from './createSupaEntryMediaUrl';

export type CreateSupaEntryMediaItemProps = {
    item: any;
    table?: string;
    volume?: string;
    sizes?: string[];
};

export const createSupaEntryMediaItem = async ({ item, volume, sizes, table }: CreateSupaEntryMediaItemProps) => {
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
        // const tmp = createSupEntryMediaSize({ item, sizes, base: baseUrl });

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

    const mobileAssetId = item?.mobile_assets_id;

    if (table && mobileAssetId) {
        const { data: mediaData } = await supabase(await cookies())
            .from(table)
            .select()
            .eq('id', mobileAssetId);

        if (sizes && mediaData && mediaData.length > 0) {
            const tmp: any = await createSupaEntryMediaItem({ item: mediaData[0], volume, sizes, table });

            if (tmp) data = Object.assign(data ?? {}, { mobileAssets: tmp });
        }
    }

    return data;
};
