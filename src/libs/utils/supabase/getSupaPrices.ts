import { supabase } from '@/libs/fetcher';
import { cookies } from 'next/headers';

import { createSupaEntryPricesItem } from '../../factory/supabase/createSupaEntryPricesItem';

export const getSupaPrices = async ({ table, id }: { table: string; id: string }) => {
    let data: any[] | null = null;

    if (id && table) {
        const { data: pricesData } = await supabase(await cookies())
            .from(table)
            .select()
            .eq('_parent_id', id)
            .order('_order', { ascending: true });

        if (pricesData && pricesData.length > 0) {
            data = [];

            pricesData.forEach((item) => {
                const price = createSupaEntryPricesItem({ item });

                if (price && data) data.push(price);
            });
        }
    }

    return data;
};
