import { supabase } from '@/libs/fetcher';
import { cookies } from 'next/headers';

import {
    createSupaEntryMediaItem,
    CreateSupaEntryMediaItemProps,
} from '../../factory/supabase/createSupaEntryMediaItem';

export type GetSupaMediaProps = {
    table: string;
    id: number;
} & Pick<CreateSupaEntryMediaItemProps, 'sizes'>;

export const getSupaMedia = async ({ table, id, sizes }: GetSupaMediaProps) => {
    let data = null;

    if (table && id) {
        const { data: mediaData } = await supabase(await cookies())
            .from(table)
            .select()
            .eq('id', id);

        if (mediaData && mediaData.length > 0) {
            data = createSupaEntryMediaItem({ item: mediaData[0], sizes: sizes ?? [] });
        }
    }

    return data;
};
