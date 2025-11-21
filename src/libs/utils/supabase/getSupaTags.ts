import { cookies } from 'next/headers';

import { supabase } from '@/libs/fetcher';
import { Tag } from '@/libs/@types';

export const getSupaTags = async ({ id }: { id: number }): Promise<Tag | null> => {
    let data: Tag | null = null;

    if (id) {
        const { data: tagsData } = await supabase(await cookies())
            .from('tags')
            .select('title,slug')
            .eq('id', id);

        if (tagsData && tagsData.length > 0) {
            const tagItem: Tag = tagsData[0] as Tag;

            data = Object.assign(data ?? {}, tagItem);
        }
    }

    return data;
};
