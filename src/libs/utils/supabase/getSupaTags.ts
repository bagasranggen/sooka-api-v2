import { cookies } from 'next/headers';

import { supabase } from '@/libs/fetcher';
import { Tag } from '@/libs/@types';

export const getSupaTags = async ({
    id,
}: {
    id: number;
}): Promise<Pick<Tag, 'slug' | 'title' | 'badgeTitle'> | null> => {
    let data: Pick<Tag, 'slug' | 'title' | 'badgeTitle'> | null = null;

    if (id) {
        const { data: tagsData } = await supabase(await cookies())
            .from('tags')
            .select('title,slug,badge_title')
            .eq('id', id);

        if (tagsData && tagsData.length > 0) {
            const { badge_title, ...restData } = tagsData[0];

            let tagItem: Pick<Tag, 'slug' | 'title' | 'badgeTitle'> = restData;
            if (badge_title) tagItem = Object.assign(restData, { badgeTitle: badge_title });

            data = Object.assign(data ?? {}, tagItem);
        }
    }

    return data;
};
