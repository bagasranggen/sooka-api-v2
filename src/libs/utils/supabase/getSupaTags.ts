import { supabase } from '@/libs/fetcher';
import { cookies } from 'next/headers';

export const getSupaTags = async ({ id }: { id: number }) => {
    let data = null;

    if (id) {
        const { data: tagsData } = await supabase(await cookies())
            .from('tags')
            .select('title,slug')
            .eq('id', id);

        if (tagsData && tagsData.length > 0) {
            const tagItem = tagsData[0];

            data = Object.assign(data ?? {}, tagItem);
        }
    }

    return data;
};
