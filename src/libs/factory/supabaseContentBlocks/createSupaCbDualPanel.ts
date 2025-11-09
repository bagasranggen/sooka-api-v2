import { supabase } from '@/libs/fetcher';
import { cookies } from 'next/headers';
import { getSupaMedia, sortArrayObject } from '@/libs/utils';

export const createSupaCbDualPanel = async ({ item }: { item: any }) => {
    const data: { layout: string | undefined; contents: any[] } = {
        layout: item?.layout,
        contents: [],
    };

    const { data: d } = await supabase(await cookies())
        .from('pages_blocks_dual_panel_contents')
        .select()
        .eq('_parent_id', item?.id)
        .order('_order', { ascending: true });

    if (d && d.length > 0) {
        await Promise.all(
            d.map(async (itm) => {
                const type = itm.type;

                let tmp = {
                    order: itm?._order,
                    type: itm?.type,
                };

                if (type === 'text') {
                    tmp = Object.assign(tmp, {
                        description: itm?.description,
                    });
                }

                if (type === 'media') {
                    tmp = Object.assign(tmp, {
                        media: await getSupaMedia({
                            table: 'media_dual_panel',
                            id: itm?.media_id,
                            volume: 'mediaDualPanel',
                            sizes: ['media950x594', 'media950x975', 'mediaSquare', 'media4x3'],
                        }),
                    });
                }

                data.contents.push(tmp);
            })
        );
    }

    if (data.contents.length > 0) sortArrayObject({ items: data.contents, key: 'order' });

    return data;
};
