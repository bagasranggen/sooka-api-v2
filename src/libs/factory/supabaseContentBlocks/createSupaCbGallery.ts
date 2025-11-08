import { supabase } from '@/libs/fetcher';
import { cookies } from 'next/headers';

import { getSupaMedia, sortArrayObject } from '@/libs/utils';

export const createSupaCbGallery = async ({ item }: { item: any }) => {
    //
    let data = undefined;

    const idx = item?._order - 1;

    const { data: d } = await supabase(await cookies())
        .from('pages_rels')
        .select()
        .eq('parent_id', item?._parent_id)
        .eq('path', `contentBlocks.${idx}.media`);

    if (d && d.length > 0) {
        const mediaTmp: any[] = [];

        await Promise.all(
            d.map(async (itm) => {
                mediaTmp.push({
                    order: itm.order,
                    ...(await getSupaMedia({
                        table: 'media_gallery',
                        id: itm?.media_gallery_id,
                        volume: 'mediaGallery',
                        sizes: ['collage1x1', 'collage4x3', 'collage3x4', 'collage3x2', 'collage2x3'],
                    })),
                });
            })
        );

        if (mediaTmp) {
            sortArrayObject({ items: mediaTmp, key: 'order' });
            data = Object.assign(data ?? {}, { media: mediaTmp });
        }
    }

    console.log({ data });

    return data;
};
