import { cookies } from 'next/headers';

import { supabase } from '../../fetcher/supabase';

export const getSupaRelatedEntry = async () => {
    const TABLE_SELECT = 'id,title,url';

    const { data: products } = await supabase(await cookies())
        .from('products')
        .select(TABLE_SELECT);

    const { data: categories } = await supabase(await cookies())
        .from('categories')
        .select(TABLE_SELECT);

    const { data: pages } = await supabase(await cookies())
        .from('pages')
        .select(TABLE_SELECT);

    return {
        products: products ?? [],
        categories: categories ?? [],
        pages: pages ?? [],
    };
};
