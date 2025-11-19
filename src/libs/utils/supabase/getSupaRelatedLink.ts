import { cookies } from 'next/headers';

import { supabase } from '@/libs/fetcher';
import { createSupaRelatedEntryLinkItem } from '../../factory/supabase/createSupaRelatedEntryLinkItem';

export const getSupaRelatedLink = async ({ table, id }: { table: string; id: number }) => {
    let data: any | null = null;

    if (table && id) {
        const { data: d } = await supabase(await cookies())
            .from(table)
            .select('id,title,url')
            .eq('id', id);

        if (d && d.length > 0) {
            data = createSupaRelatedEntryLinkItem({ item: d[0] });
        }
    }

    return data;
};
