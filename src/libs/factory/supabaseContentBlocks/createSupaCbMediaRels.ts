import { cookies } from 'next/headers';

import { supabase } from '@/libs/fetcher';
import { getSupaMedia, GetSupaMediaProps, sortArrayObject } from '@/libs/utils';

export type CreateSupaCbMediaRelsProps = {
    item: any;
    idHandle?: string;
    mediaKey?: string;
} & Pick<GetSupaMediaProps, 'table' | 'volume' | 'sizes'>;

export const createSupaCbMediaRels = async ({
    item,
    table,
    idHandle,
    volume,
    sizes,
    mediaKey = 'media',
}: CreateSupaCbMediaRelsProps) => {
    let data = null;

    const idx = item?._order - 1;

    const { data: d } = await supabase(await cookies())
        .from('pages_rels')
        .select()
        .eq('parent_id', item?._parent_id)
        .eq('path', `contentBlocks.${idx}.media`);

    if (table && idHandle && volume && sizes && d && d.length > 0) {
        const mediaTmp: any[] = [];

        await Promise.all(
            d.map(async (itm) => {
                mediaTmp.push({
                    order: itm.order,
                    ...(await getSupaMedia({
                        table,
                        id: itm?.[idHandle as any],
                        volume,
                        sizes,
                    })),
                });
            })
        );

        if (mediaTmp && mediaKey) {
            sortArrayObject({ items: mediaTmp, key: 'order' });
            data = Object.assign(data ?? {}, { media: mediaTmp });
        }
    }

    return data;
};
