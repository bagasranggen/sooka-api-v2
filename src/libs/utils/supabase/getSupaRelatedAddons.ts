import { supabase } from '@/libs/fetcher';
import { cookies } from 'next/headers';

import { createSupaEntryStatus } from '../../factory/supabase/createSupaEntryStatus';
import { getSupaMedia } from './getSupaMedia';
import { getSupaPrices } from './getSupaPrices';
import { sortArrayObject } from '@/libs/utils';

export const getSupaRelatedAddons = async ({ id }: { id: number }) => {
    const data: any[] = [];

    if (id) {
        const { data: relsData } = await supabase(await cookies())
            .from('products_rels')
            .select('addons_id')
            .eq('path', 'addons')
            .eq('parent_id', id)
            .order('order', { ascending: true });

        const ids = relsData ? relsData.map((item) => item.addons_id) : [];

        const { data: addonsData } = await supabase(await cookies())
            .from('addons')
            .select()
            .in('id', ids);

        if (addonsData && addonsData.length > 0) {
            await Promise.all(
                addonsData.map(async (item, i) => {
                    const { isLive } = createSupaEntryStatus(item);

                    if (!isLive) return;

                    const id = item.id;
                    const mediaId = item?.thumbnail_id;

                    data.push({
                        order: i,
                        title: item.title,
                        slug: item.slug,
                        prices: await getSupaPrices({ table: 'addons_prices', id }),
                        thumbnail: await getSupaMedia({
                            table: 'media_addon',
                            id: mediaId,
                            volume: 'mediaAddon',
                            sizes: ['assets400x400'],
                        }),
                    });
                })
            );
        }
    }

    if (data) sortArrayObject({ items: data, key: 'order' });

    return data;
};
