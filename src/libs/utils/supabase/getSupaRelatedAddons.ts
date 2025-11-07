import { supabase } from '@/libs/fetcher';
import { cookies } from 'next/headers';

import { createSupaEntryStatus } from '../../factory/supabase/createSupaEntryStatus';
import { getSupaMedia } from './getSupaMedia';
import { getSupaPrices } from './getSupaPrices';

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
                addonsData.map(async (item) => {
                    const { isLive } = createSupaEntryStatus(item);

                    if (!isLive) return;

                    const id = item.id;
                    const mediaId = item?.thumbnail_id;

                    // const { data: pricesData } = await supabase(await cookies())
                    //     .from('addons_prices')
                    //     .select()
                    //     .eq('_parent_id', id);
                    //
                    // const prices: any[] = [];
                    //
                    // if (pricesData && pricesData.length > 0) {
                    //     pricesData.forEach((item) => {
                    //         const price = createSupaEntryPricesItem({ item });
                    //
                    //         if (price) prices.push(price);
                    //     });
                    // }

                    data.push({
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

    return data;
};
