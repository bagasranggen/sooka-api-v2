import { cookies } from 'next/headers';

import { supabase } from '@/libs/fetcher';
import { createSupaEntryCategoriesItem } from '../../factory/supabase/createSupaEntryCategoriesItem';

export const getSupaCategories = async ({ id }: { id: number }) => {
    let data = null;

    if (id) {
        const { data: categoriesData } = await supabase(await cookies())
            .from('categories')
            .select()
            .eq('id', id);

        if (categoriesData && categoriesData.length > 0) {
            data = createSupaEntryCategoriesItem({ item: categoriesData[0] });
        }
    }

    return data;
};
