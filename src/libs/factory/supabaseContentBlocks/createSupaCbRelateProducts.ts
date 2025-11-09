import { supabase } from '@/libs/fetcher';
import { cookies } from 'next/headers';
import { createSupaRelatedProducts } from '@/libs/factory';

export const createSupaCbRelateProducts = async ({ item }: { item: any }) => {
    let data = null;

    if (item) {
        const idx = item?._order - 1;

        if (item?.title) {
            data = Object.assign(data ?? {}, { title: item?.title });
        }

        const { data: d } = await supabase(await cookies())
            .from('pages_rels')
            .select()
            .eq('parent_id', item?._parent_id)
            .eq('path', `contentBlocks.${idx}.products`);

        const productIds: any[] = [];
        if (d && d.length > 0) {
            d.forEach((datum) => productIds.push(datum.products_id));
        }

        const productsData = await createSupaRelatedProducts({ productIds });

        if (productsData && productsData.length > 0) {
            data = Object.assign(data ?? {}, { products: productsData });
        }
    }

    return data;
};
