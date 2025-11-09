import { cookies } from 'next/headers';
import { supabase } from '@/libs/fetcher';

export const getSupaProducts = async ({ id }: { id?: number | number[] }) => {
    let data = null;

    let productId: any[] = [];
    if (typeof id === 'number') productId = [id];
    if (typeof id === 'object') productId = id;

    if (productId && productId.length > 0) {
        const { data: productsData } = await supabase(await cookies())
            .from('products')
            .select()
            .in('id', productId)
            .order('slug', { ascending: true });

        if (productsData && productsData.length > 0) {
            data = productsData;
        }
    }

    return data;
};
